import {
  type CustomResource,
  CUSTOMRESOURCE_GROUP,
  CUSTOMRESOURCE_PLURAL,
  CUSTOMRESOURCE_VERSION,
  zCustomResource,
} from "./schemas.ts";
import { k8sApiCustomObject } from "../../k8s.ts";
import { log } from "../../util.ts";
import { getConfig } from "../../config.ts";
import { updateStatus } from "./handlers.ts";

export const reconcileResource = async (apiObj: CustomResource) => {
  log(
    `Reconciling CR of type ${CUSTOMRESOURCE_PLURAL}, name: ${apiObj.metadata.name}`,
  );

  // Implement whatever reconciliation logic you need here
  log(`${getConfig().BASE_GREETING} ${apiObj.spec.name}`);
  await updateStatus(apiObj.metadata.name, {
    randomNumber: Math.random(),
  });
};

export const reconcileAllResources = async () => {
  const customResources = ((await k8sApiCustomObject.listClusterCustomObject(
    CUSTOMRESOURCE_GROUP,
    CUSTOMRESOURCE_VERSION,
    CUSTOMRESOURCE_PLURAL,
  )).body as {
    items: CustomResource[];
  }).items;
  await Promise.all(
    customResources.map((cr) => reconcileResource(zCustomResource.parse(cr))),
  );
};
