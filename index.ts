import { Bot } from "grammy";
import { env } from "./common/env.config";

const bot = new Bot(env.TOKEN);
bot.start({ drop_pending_updates: true });
