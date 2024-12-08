import { startWatching as startGreetingWatchers } from "./greetings/handlers.ts";

import { scheduleJobs as scheduleGreetingCleanupJobs } from "./greetings/cleanupQueue.ts";
import { scheduleJobs as scheduleGreetingReconciliationJobs } from "./greetings/reconciliationQueue.ts";

export const startAllWatchers = async () => {
  await Promise.all([
    startGreetingWatchers(),
    // Add all watchers here
  ]);
};

export const startAllQueues = async () => {
  await Promise.all([
    scheduleGreetingCleanupJobs(),
    scheduleGreetingReconciliationJobs(),
    // Add all queues here
  ]);
};
