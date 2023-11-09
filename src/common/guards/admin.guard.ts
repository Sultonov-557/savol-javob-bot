import { Context, NextFunction } from "grammy";
import { env } from "../config/env.config";

export function adminGuard(ctx: Context, next: NextFunction) {
  if (env.ADMIN_ID == ctx.from?.id) {
    next();
  }
}
