import nodemailer from "nodemailer";
import { env, isSmtpConfigured } from "../config/env";
import { ApiError } from "../utils/apiError";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const buildTransport = () => {
  if (!isSmtpConfigured) {
    return null;
  }

  const host = env.SMTP_HOST;
  const port = env.SMTP_PORT;
  const user = env.SMTP_AUTH_USER;
  const pass = env.SMTP_AUTH_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const transport = buildTransport();

export const canSendEmail = (): boolean => Boolean(transport);

export const sendMail = async ({ to, subject, text, html }: MailInput) => {
  if (!transport || !env.SENDER_EMAIL) {
    throw new ApiError(503, "Email service is not configured");
  }

  try {
    return await transport.sendMail({
      from: env.SENDER_EMAIL,
      to,
      subject,
      text,
      html,
    });
  } catch {
    throw new ApiError(
      502,
      "Email delivery failed. Check SMTP credentials and sender configuration.",
    );
  }
};
