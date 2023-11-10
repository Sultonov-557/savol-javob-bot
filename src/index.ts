import { Bot, InlineKeyboard, session } from "grammy";
import { env } from "./common/config/env.config";
import { adminGuard } from "./common/guards/admin.guard";
import { NewContext } from "./common/types/Context.type";
import { conversations, createConversation } from "@grammyjs/conversations";
import { addQuestion } from "./common/conversations/addQuestion.conversation";
import * as db from "./database/db";

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
		ctx.reply("/yangiSavol - yangi savol qoshish");
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
	ctx.conversation.enter("addQuestion");
});

bot.command("savol", (ctx) => {
	const themes = db.getThemes();
	const keyboard = new InlineKeyboard();
	for (let i of themes) {
		keyboard.text(i, `theme_${i}`);
	}

	ctx.reply("mavzulardan birini tanlang", { reply_markup: keyboard });
});

bot.on("callback_query", (ctx) => {
	const data = ctx.callbackQuery.data;
	if (data?.startsWith("theme_")) {
		const theme = data.replace("theme_", "");
		const questions = db.getQuestionsByTheme(theme);
		const keyboard = new InlineKeyboard();
		for (let i of questions) {
			keyboard.text(i.text, `question_${i.id}`);
		}

		ctx.reply("savollardan birini tanlang", { reply_markup: keyboard });
	}
	if (data?.startsWith("question_")) {
		const questionID = +data.replace("question_", "");
		const question = db.getQuestionsByID(questionID);
		if (!question) return;
		const keyboard = new InlineKeyboard();
		let allAnswers: string[] = [];
		allAnswers = allAnswers.concat(question?.answers);
		allAnswers.push(question?.rightAnswer);
		allAnswers.sort();
		for (let i of allAnswers) {
			keyboard.text(i, `answerto_${questionID}_${i}`);
		}
		ctx.reply(question.text, { reply_markup: keyboard });
	}
	if (data?.startsWith("answerto_")) {
		const args = data.replace("answerto_", "").split("_");
		const questionID = +args[0];
		const answer = args[1];
		const question = db.getQuestionsByID(questionID);
		if (question?.rightAnswer == answer) {
			ctx.reply("javob to'g'ri");
		} else {
			ctx.reply("javob noto'g'ri");
		}
	}
});
