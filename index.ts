import { Bot, Context, SessionFlavor, session } from "grammy";
import { env } from "./common/env.config";
import { quentions } from "./common/jsonLoader";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";

type NewContext = Context & ConversationFlavor;
type NewConversation = Conversation<NewContext>;

async function savol(conversation: NewConversation, ctx: NewContext) {
  const quention = quentions[random(0, quentions.length - 1)];
  let done = false;
  while (!done) {
    ctx.reply(quention.savol);
    const ans = (await conversation.form.text()).toLocaleLowerCase();
    if (ans == quention.javob) {
      done = true;
    }
  }
  ctx.reply("javob tog'ri");
}

const bot = new Bot<NewContext>(env.TOKEN);
bot.start({ drop_pending_updates: true });

bot.use(
  session({
    initial: () => {
      return {};
    },
  })
);

bot.use(conversations());

bot.use(createConversation(savol));

bot.command("start", (ctx) => {
  ctx.reply("salom botga hush kelibsiz");
});

bot.command("savol", (ctx) => {
  ctx.conversation.enter("savol");
});

function random(min: number, max: number) {
  const rand = Math.floor(Math.random() * (max - min) + min);
  return rand;
}
