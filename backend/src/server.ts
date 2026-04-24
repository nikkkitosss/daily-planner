import app from "./app";
import { env } from "./config/env";
import { startReminderDispatcher } from "./services/reminder.dispatcher";

const port = env.PORT;

app.listen(port, () => {
  console.log(`Daily Planner API running on port ${port}`);
  startReminderDispatcher();
});
