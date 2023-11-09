import { Bot, session } from "grammy";
import { env } from "./common/config/env.config";
import { adminGuard } from "./common/guards/admin.guard";
import { NewContext } from "./common/types/Context.type";
import { conversations, createConversation } from "@grammyjs/conversations";
import { addQuestion } from "./common/conversations/addQuestion.conversation";

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
bot.use(createConversation(addQuestion, { id: "addQuestion" }));

bot.command("start", (ctx) => {
	ctx.reply("salom botga hush kelibsiz");
});

bot.command("myid", adminGuard, (ctx) => {
	if (ctx.from) {
		ctx.reply(`sizning idizngiz: ${ctx.from.id}`);
	}
});

bot.command("addQuestion", adminGuard, (ctx) => {
	console.log("hello");

	ctx.conversation.enter("addQuestion");
});
