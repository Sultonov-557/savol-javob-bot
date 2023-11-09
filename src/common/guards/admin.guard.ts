import { NextFunction } from "grammy";
import { env } from "../config/env.config";
import { NewContext } from "../types/Context.type";

export function adminGuard(ctx: NewContext, next: NextFunction) {
	console.log("hello");

	if (env.ADMIN_ID == ctx.from?.id) {
		next();
	}
}
