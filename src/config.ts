import { env } from "node:process";
import { z } from "npm:zod";

const zConfig = z.object({
  BASE_GREETING: z.string().min(1).describe(
    "Basic greeting which is appended by the name of the person to greet",
  ),
  REDIS_CONNECTION_STRING: z.string().startsWith("redis://"),
});

export const getConfig = () => zConfig.parse(env);

export const validateConfig = () => {
  zConfig.parse(env);
};
