import { Bot, InlineKeyboard, session } from "grammy";
import { env } from "./common/config/env.config";
import { adminGuard } from "./common/guards/admin.guard";
import { NewContext } from "./common/types/Context.type";
import { conversations, createConversation } from "@grammyjs/conversations";
import { addQuestion } from "./common/conversations/addQuestion.conversation";
import * as db from "./database/db";
import { channelGuard } from "./common/guards/channel.guard";
import { userGuard } from "./common/guards/user.guard";
import { Result } from "./database/entity/results.entity";

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

bot.use(channelGuard);
bot.use(userGuard);

bot.command("start", (ctx) => {
  ctx.reply("salom botga hush kelibsiz buyruqlarni ro'yhati uchun /help dan foydalaning");
});

bot.command("help", (ctx) => {
  if (ctx.from?.id == env.ADMIN_ID) {
    ctx.reply("/yangiSavol - yangi savol qoshish\n/users - foydalanuvchilar ro'yhatini olish\n/user <id> foydalanuvchini javoblarini ko'rish");
  } else {
    ctx.reply("/savol - savollarga javob berish");
  }
});

bot.command("users", adminGuard, (ctx) => {
  let list = "";
  const users = db.getUsers();
  for (let i of users) {
    list += `id: ${i.id} ism: ${i.name}`;
  }
  ctx.reply(list);
});

bot.hears(/\/user (\d+)/, adminGuard, (ctx) => {
  const userID = +ctx.match[1];
  const user = db.getUser(userID);
  if (user) {
    let text = `ism: ${user.name}\nball: ${user.score}\njavoblar:\n`;
    for (let i of user.results) {
      const question = db.getQuestionsByID(i.questionID);
      if (question) {
        const date = `${i.answerTime.getHours()}:${i.answerTime.getMinutes()} ${i.answerTime.toDateString()}`;
        text += `${question.text} ${date} `;
        if (i.correct) {
          text += "to'g'ri javob\n";
        } else {
          text += "noto'g'ri javob\n";
        }
      }
    }
    ctx.reply(text);
  } else {
    ctx.reply("bunaqa odam topilmadi");
  }
});

bot.command("me", (ctx) => {
  let text = `ism: ${ctx.user.name}\nball: ${ctx.user.score}\njavoblar:\n`;
  for (let i of ctx.user.results) {
    const question = db.getQuestionsByID(i.questionID);
    if (question) {
      const date = `${i.answerTime.getHours()}:${i.answerTime.getMinutes()} ${i.answerTime.toDateString()}`;
      text += `${question.text} ${date} `;
      if (i.correct) {
        text += "to'g'ri javob\n";
      } else {
        text += "noto'g'ri javob\n";
      }
    }
  }
  ctx.reply(text);
});

bot.command("yangiSavol", adminGuard, (ctx) => {
  ctx.conversation.enter("addQuestion");
});

bot.command("savol", (ctx) => {
  const themes = db.getThemes(1);
  const keyboard = new InlineKeyboard();

  for (let i in themes) {
    keyboard.text(themes[i], `theme_${themes[i]}`);
    if (+i == 2 || +i == 5) {
      keyboard.row();
    }
  }

  if (db.getAllThemes().length > 9) {
    keyboard.row();
    keyboard.text("->", "getThemes_2");
  }
  ctx.reply("mavzulardan birini tanlang", { reply_markup: keyboard });
});

bot.on("callback_query", (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data?.startsWith("getThemes_")) {
    const page = +data.replace("getThemes_", "");
    const themes = db.getThemes(page);
    const keyboard = new InlineKeyboard();

    for (let i in themes) {
      keyboard.text(themes[i], `theme_${themes[i]}_1`);
      if (+i == 2 || +i == 5) {
        keyboard.row();
      }
    }
    keyboard.row();

    if (page != 1) {
      keyboard.text("<-", `getThemes_${page - 1}`);
    }
    if (db.getAllThemes().length > 9 * page) {
      keyboard.text("->", `getThemes_${page + 1}`);
    }

    ctx.editMessageText("mavzulardan birini tanlang", { reply_markup: keyboard });
  }

  if (data?.startsWith("themes_")) {
    const args = data.replace("themes_", "");
    const [theme, page] = args.split("_");
    const questions = db.getQuestionsByTheme(theme, +page);
    const keyboard = new InlineKeyboard();
    for (let i in questions) {
      keyboard.text(questions[i].text, `question_${questions[i].id}`);
      if (+i == 2 || +i == 5) {
        keyboard.row();
      }
    }

    keyboard.row();

    if (+page != 1) {
      keyboard.text("<-", `themes_${theme}_${+page - 1}`);
    }
    if (db.getAllQuestionsByTheme(theme).length > 9 * +page) {
      keyboard.text("->", `themes_${theme}_${+page + 1}`);
    }

    ctx.editMessageText("savollardan birini tanlang", { reply_markup: keyboard });
  }
  if (data?.startsWith("question_")) {
    const questionID = +data.replace("question_", "");
    const question = db.getQuestionsByID(questionID);
    if (!question) return;

    if (db.isAnswered(ctx.user.id, question.id)) {
      ctx.answerCallbackQuery("bu savolga allaqachon javob bergansiz");
      return;
    }

    const keyboard = new InlineKeyboard();
    let allAnswers: string[] = [];
    allAnswers = allAnswers.concat(question?.answers);
    allAnswers.push(question?.rightAnswer);
    allAnswers.sort();
    keyboard.text(allAnswers[0], `answerto_${questionID}_${allAnswers[0]}`);
    keyboard.text(allAnswers[1], `answerto_${questionID}_${allAnswers[1]}`).row();
    keyboard.text(allAnswers[2], `answerto_${questionID}_${allAnswers[2]}`);
    keyboard.text(allAnswers[3], `answerto_${questionID}_${allAnswers[3]}`);

    ctx.editMessageText(question.text, { reply_markup: keyboard });
  }
  if (data?.startsWith("answerto_")) {
    const args = data.replace("answerto_", "").split("_");
    const questionID = +args[0];
    const answer = args[1];
    const question = db.getQuestionsByID(questionID);
    if (question) {
      if (question.rightAnswer == answer) {
        ctx.editMessageText("to'g'ri javob");
        ctx.user.results.push(new Result(question.id, true));
        ctx.user.score += 1;
      } else {
        ctx.editMessageText("javob noto'g'ri");
        ctx.user.results.push(new Result(question.id, false));
        ctx.user.score -= 1;
      }
    }
  }
});
