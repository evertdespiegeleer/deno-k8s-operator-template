import z from "npm:zod";
import { k8sApiCustomObject, watcher } from "../../k8s.ts";
import { log } from "../../util.ts";
import {
  CUSTOMRESOURCE_GROUP,
  CUSTOMRESOURCE_PLURAL,
  CUSTOMRESOURCE_VERSION,
  zCrdStatus,
  zCustomResource,
} from "./schemas.ts";
import process from "node:process";
import { reconcileResource } from "./reconciliation.ts";
import { scheduleJobNow as scheduleCleanupJobNow } from "./cleanupQueue.ts";

async function onEvent(
  _phase: string,
  apiObj: object,
) {
  const phase = _phase as "ADDED" | "MODIFIED" | "DELETED";
  const parsedApiObj = zCustomResource.parse(apiObj);
  log(`Event received for CRD ${CUSTOMRESOURCE_PLURAL}: ${phase}`);
  if (phase === "ADDED" || phase === "MODIFIED") {
    if (phase === "MODIFIED") {
      if (
        parsedApiObj.status?.lastReconciliation != null &&
        (new Date().getTime() -
            new Date(parsedApiObj.status.lastReconciliation).getTime() < 5000)
      ) {
        // Don't trigger in case the modification is _likely_ performed by the operator itself to prevent an endless loop. Non ideal, but haven't yet found a better way
        // TODO: find a better way to handle this
        return;
      }
    }
    await reconcileResource(parsedApiObj);
  }
  if (phase === "DELETED") {
    await scheduleCleanupJobNow();
  }
}

export async function updateStatus(
  k8sResourceName: string,
  status: z.input<typeof zCrdStatus>,
) {
  const resourceFetch = await k8sApiCustomObject.getClusterCustomObject(
    CUSTOMRESOURCE_GROUP,
    CUSTOMRESOURCE_VERSION,
    CUSTOMRESOURCE_PLURAL,
    k8sResourceName,
  );
  const currentObj = zCustomResource.parse(resourceFetch.body);

  const crdUpdatedStatusPatch = {
    apiVersion: currentObj.apiVersion,
    kind: currentObj.kind,
    metadata: {
      name: currentObj.metadata.name,
    },
    status: zCrdStatus.parse({
      lastReconciliation: new Date().toISOString(),
      ...status,
    }),
  };

  try {
    await k8sApiCustomObject.patchClusterCustomObject(
      CUSTOMRESOURCE_GROUP,
      CUSTOMRESOURCE_VERSION,
      CUSTOMRESOURCE_PLURAL,
      k8sResourceName,
      crdUpdatedStatusPatch,
      undefined,
      "operator",
      undefined,
      {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      },
    );
  } catch (error) {
    log("Failed to update cr status");
    throw error;
  }
}

export async function startWatching() {
  await watcher.watch(
    `/apis/${CUSTOMRESOURCE_GROUP}/${CUSTOMRESOURCE_VERSION}/${CUSTOMRESOURCE_PLURAL}`,
    {},
    onEvent,
    (err) => {
      log(`Connection closed. ${err}`);
      process.exit(1);
    },
  );
}
