import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export const env = cleanEnv(process.env, {
  TOKEN: str(),
  ADMIN_ID: num(),
});
