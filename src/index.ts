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
	ctx.reply("salom botga hush kelibsiz buyruqlarni ro'yhati uchun /help dan foydalaning");
});

bot.command("help", (ctx) => {
	if (ctx.from?.id == env.ADMIN_ID) {
		ctx.reply("/addQuestion - yangi savol qoshish");
	} else {
		ctx.reply("");
	}
});

bot.command("myid", adminGuard, (ctx) => {
	if (ctx.from) {
		ctx.reply(`sizning idizngiz: ${ctx.from.id}`);
	}
});

bot.command("yangiSavol", adminGuard, (ctx) => {
	console.log("hello");

	ctx.conversation.enter("addQuestion");
});

bot.command("savol",(ctx)=>{
	
});
