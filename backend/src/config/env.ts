import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default("7d"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_AUTH_USER: z.string().trim().optional(),
  SMTP_AUTH_PASS: z.string().trim().optional(),
  SENDER_EMAIL: z.string().trim().email().optional(),
  REMINDER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(30_000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${issues}`);
}

const smtpFields = [
  parsedEnv.data.SMTP_HOST,
  parsedEnv.data.SMTP_PORT,
  parsedEnv.data.SMTP_AUTH_USER,
  parsedEnv.data.SMTP_AUTH_PASS,
  parsedEnv.data.SENDER_EMAIL,
];

const hasAnySmtpConfig = smtpFields.some((field) => Boolean(field));
const hasAllSmtpConfig = smtpFields.every((field) => Boolean(field));

if (hasAnySmtpConfig && !hasAllSmtpConfig) {
  throw new Error(
    "Invalid environment configuration: all SMTP fields must be configured together",
  );
}

export const env = parsedEnv.data;

export const isSmtpConfigured = hasAllSmtpConfig;
