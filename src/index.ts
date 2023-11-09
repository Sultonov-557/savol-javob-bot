import { Bot } from "grammy";
import { conversations } from "@grammyjs/conversations";
import { env } from "./common/config/env.config";
import { adminGuard } from "./common/guards/admin.guard";

const bot = new Bot(env.TOKEN);
bot.start({ drop_pending_updates: true });

bot.command("start", (ctx) => {
  ctx.reply("salom botga hush kelibsiz");
});

bot.command("myid", adminGuard, (ctx) => {
  if (ctx.from) {
    ctx.reply(`sizning idizngiz: ${ctx.from.id}`);
  }
});
