import { validateConfig } from "./config.ts";
import "./k8s.ts";
import { startAllQueues, startAllWatchers } from "./crds/startWatchers.ts";
import { log } from "./util.ts";

async function start() {
  log("Validating configuration...");
  await validateConfig();

  log("Starting k8s watchers...");
  await startAllWatchers();

  log("Starting queues...");
  await startAllQueues();
}

start().catch((err) => {
  throw err;
});
