import z from "npm:zod";

export const zCrdSpec = z.object({
  name: z.string().optional().default("Stranger"),
});

export const zCrdStatus = z.object({
  lastReconciliation: z.string().optional(),
  randomNumber: z.number().optional(),
}).optional();

export const zCustomResource = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
  }).passthrough(),
  spec: zCrdSpec,
  status: zCrdStatus,
});

export type CustomResource = z.output<typeof zCustomResource>;

export const CUSTOMRESOURCE_GROUP = "k8s.evertdespiegeleer.com";
export const CUSTOMRESOURCE_VERSION = "v1alpha1";
export const CUSTOMRESOURCE_PLURAL = "greetings";
