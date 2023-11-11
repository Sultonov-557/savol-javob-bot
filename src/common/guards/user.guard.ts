import { InlineKeyboard, NextFunction } from "grammy";
import { NewContext } from "../types/Context.type";
import * as db from "../../database/db";
import { User } from "../../database/entity/user.entity";

export async function userGuard(ctx: NewContext, next: NextFunction) {
  if (ctx.from) {
    let user = db.getUser(ctx.from.id);
    if (!user) {
      user = new User(ctx.from.id, ctx.from.first_name, 0);
      db.newUser(user);
    }
    ctx.user = user;
  }
  next();
}
