import { InlineKeyboard, NextFunction } from "grammy";
import { NewContext } from "../types/Context.type";
import * as db from "../../database/db";

export async function userGuard(ctx: NewContext, next: NextFunction) {
  if (ctx.from) {
    let user = await db.getUser(ctx.from.id + "");
    if (!user) {
      user = await db.newUser(
        ctx.from.id + "",
        ctx.from.first_name
          .split("")
          .filter((v) => {
            if (isLetter(v) || v == " " || !isNaN(+v)) {
              return true;
            } else {
              return false;
            }
          })
          .join("")
      );
    }
    ctx.user = user;
  }
  next();
}

function isLetter(c: string) {
  return c.toLowerCase() != c.toUpperCase();
}
