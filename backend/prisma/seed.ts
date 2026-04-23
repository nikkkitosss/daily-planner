import bcrypt from "bcryptjs";
import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      password,
    },
  });

  const workTag = await prisma.tag.upsert({
    where: {
      name_userId: {
        name: "work",
        userId: user.id,
      },
    },
    update: {},
    create: {
      name: "work",
      userId: user.id,
    },
  });

  const existingTask = await prisma.task.findFirst({
    where: {
      userId: user.id,
      title: "Welcome task",
    },
  });

  if (!existingTask) {
    await prisma.task.create({
      data: {
        title: "Welcome task",
        description: "This task is created by seed",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user.id,
        taskTags: {
          create: [{ tagId: workTag.id }],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
