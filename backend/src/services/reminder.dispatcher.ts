import { prisma } from "../prisma/client";
import { env } from "../config/env";
import { canSendEmail, sendMail } from "./mail.service";

let pollTimer: NodeJS.Timeout | null = null;
let isProcessing = false;

const buildReminderEmail = (message: string, remindAt: Date) => {
  const remindAtUtc = remindAt.toISOString();

  return {
    subject: "Daily Planner reminder",
    text: `Reminder time: ${remindAtUtc}\n\n${message}`,
    html: `<p><strong>Reminder time (UTC):</strong> ${remindAtUtc}</p><p>${message}</p>`,
  };
};

export const dispatchDueReminders = async (): Promise<void> => {
  if (isProcessing || !canSendEmail()) {
    return;
  }

  isProcessing = true;

  try {
    const dueReminders = await prisma.reminder.findMany({
      where: {
        isSent: false,
        remindAt: { lte: new Date() },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        remindAt: "asc",
      },
      take: 50,
    });

    for (const reminder of dueReminders) {
      const message = buildReminderEmail(reminder.message, reminder.remindAt);

      try {
        await sendMail({
          to: reminder.user.email,
          subject: message.subject,
          text: message.text,
          html: message.html,
        });

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { isSent: true },
        });
      } catch (error) {
        console.error(
          `Failed to deliver reminder ${reminder.id} to ${reminder.user.email}`,
          error,
        );
      }
    }
  } finally {
    isProcessing = false;
  }
};

export const startReminderDispatcher = (): void => {
  if (pollTimer) {
    return;
  }

  if (!canSendEmail()) {
    console.warn(
      "Reminder dispatcher is disabled because SMTP environment variables are not fully configured.",
    );
    return;
  }

  void dispatchDueReminders();

  pollTimer = setInterval(() => {
    void dispatchDueReminders();
  }, env.REMINDER_POLL_INTERVAL_MS);
};
