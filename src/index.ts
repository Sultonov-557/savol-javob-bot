import { Bot, InlineKeyboard, session } from "grammy";
import { env } from "./common/config/env.config";
import { adminGuard } from "./common/guards/admin.guard";
import { NewContext } from "./common/types/Context.type";
import { conversations, createConversation } from "@grammyjs/conversations";
import { addQuestion } from "./common/conversations/addQuestion.conversation";
import { channelGuard } from "./common/guards/channel.guard";
import * as db from "./database/db";
import { userGuard } from "./common/guards/user.guard";

const bot = new Bot<NewContext>(env.TOKEN);

bot.start({ drop_pending_updates: true });
console.log("bot started");

//no    no   no no no    no no no
// no  no    no         no
//  nono     no no no    no no no
//   no      no                 no
//   no      no no no    no no no

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
  ctx.reply(
    "Salom botga hush kelibsiz.\nBuyruqlarni ro'yhati uchun /help dan foydalaning"
  );
});

bot.command("help", (ctx) => {
  if (ctx.from?.id == env.ADMIN_ID) {
    ctx.reply(
      "/yangisavol - Yangi savol qoshish\n/users - Foydalanuvchilar ro'yhatini olish\n/user <id> - Foydalanuvchini javoblarini ko'rish\n/savol - Savollarga javob berish\n/me - O'zingiz haqingizda malumot olish"
    );
  } else {
    ctx.reply(
      "/savol - Savollarga javob berish\n/me - O'zingiz haqida malumot olish"
    );
  }
});

bot.command("users", adminGuard, async (ctx) => {
  let list = "";
  const users = await db.getUsers();
  for (let i of users) {
    list += `ID: ${i.ID} Ism👤: ${i.name}\n`;
  }
  ctx.reply(list);
});

bot.hears(/\/user (\d+)/, adminGuard, async (ctx) => {
  const userID = +ctx.match[1];
  const user = await db.getUser(userID + "");
  if (user) {
    let text = `Ism👤: ${user.name}\nBall🏆: ${user.score}\nJavoblar✅:\n`;
    for (let i of user.results) {
      const question = await db.getQuestionByID(i.question.ID);
      if (question) {
        const date = `${i.answerTime.getHours()}:${i.answerTime.getMinutes()} ${i.answerTime.toDateString()}`;
        text += `${question.text} ${date} `;
        if (i.correct) {
          text += "To'g'ri javob ✅\n";
        } else {
          text += "Noto'g'ri javob❌\n";
        }
      }
    }
    ctx.reply(text);
  } else {
    ctx.reply("Bunaqa odam topilmadi");
  }
});

bot.command("me", async (ctx) => {
  let text = `Ism👤: ${ctx.user.name}\nBall🏆: ${ctx.user.score}`;
  ctx.reply(text);

  const themes: any = {};

  for (let i in ctx.user.results) {
    const result = ctx.user.results[i];

    const question = await db.getQuestionByID(result.question.ID);
    if (!question) return;

    if (Object.keys(themes).includes(question.theme)) {
      themes[question.theme].push(result);
    } else {
      themes[question.theme] = [result];
    }
  }

  for (let i in themes) {
    const theme = themes[i];
    const time: Date = theme[0].answerTime;
    const all = theme.length;
    let right = 0;
    for (let i in theme) {
      if (theme[i].correct) {
        right++;
      }
    }

    ctx.reply(
      `${i}:\nto'gri javoblar: ${right}/${all}\njavob berilgan vaqt: ${time.toLocaleString()}`
    );
  }
});

bot.command("yangisavol", adminGuard, (ctx) => {
  ctx.conversation.enter("addQuestion");
});

bot.command("savol", async (ctx) => {
  const themes = await db.getThemes(1);

  const keyboard = new InlineKeyboard();

  for (let i in themes) {
    keyboard.text(themes[i], `themes_${themes[i]}`);
    if (+i == 2 || +i == 5) {
      keyboard.row();
    }
  }

  if ((await db.getAllThemes()).length > 9) {
    keyboard.row();
    keyboard.text("->", "getThemes_2");
  }
  ctx.reply("mavzulardan birini tanlang", {
    reply_markup: keyboard,
  });
});

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data?.startsWith("getThemes_")) {
    const page = +data.replace("getThemes_", "");
    const themes = await db.getThemes(page);
    const keyboard = new InlineKeyboard();

    for (let i in themes) {
      keyboard.text(themes[i], `themes_${themes[i]}`);
      if (+i == 2 || +i == 5) {
        keyboard.row();
      }
    }

    keyboard.row();

    if (page != 1) {
      keyboard.text("<-", `getThemes_${page - 1}`);
    }

    if ((await db.getAllThemes()).length > 9 * page) {
      keyboard.text("->", `getThemes_${page + 1}`);
    }

    ctx.editMessageText("mavzulardan birini tanlang", {
      reply_markup: keyboard,
    });
  }

  if (data?.startsWith("themes_")) {
    const theme = data.replace("themes_", "");
    const questionID = await db.getNextQuestion(ctx.user, theme);
    if (!questionID) return;
    const question = await db.getQuestionByID(questionID);
    if (!question) return;

    if (await db.isAnswered(ctx.user.ID, question.ID)) {
      ctx.answerCallbackQuery("bu savolga allaqachon javob bergansiz");
      return;
    }

    const keyboard = new InlineKeyboard();
    let allAnswers: string[] = [];
    allAnswers = allAnswers.concat(JSON.parse(question?.answers));
    allAnswers.push(question?.rightAnswer);
    allAnswers.sort();
    keyboard.text(allAnswers[0], `answerTo_${questionID}_${allAnswers[0]}`);
    keyboard
      .text(allAnswers[1], `answerTo_${questionID}_${allAnswers[1]}`)
      .row();
    keyboard.text(allAnswers[2], `answerTo_${questionID}_${allAnswers[2]}`);
    keyboard.text(allAnswers[3], `answerTo_${questionID}_${allAnswers[3]}`);

    ctx.editMessageText(question.text, {
      reply_markup: keyboard,
    });
  }
  if (data?.startsWith("answerTo_")) {
    const args = data.replace("answerTo_", "").split("_");
    const questionID = +args[0];
    const answer = args[1];
    const question = await db.getQuestionByID(questionID);

    if (!question) return;

    if (await db.isAnswered(ctx.user.ID, question.ID)) {
      ctx.answerCallbackQuery("bu savolga allaqachon javob bergansiz");
      return;
    }

    if (question.rightAnswer == answer) {
      await db.newResult({
        user: ctx.user,
        question,
        answerTime: new Date(),
        correct: true,
      });
      ctx.user.score += 1;
    } else {
      await db.newResult({
        user: ctx.user,
        question,
        answerTime: new Date(),
        correct: false,
      });
    }
    await db.saveUser(ctx.user);

    const nextQuestionID = await db.getNextQuestion(
      ctx.user,
      question.theme,
      question.ID
    );

    if (!nextQuestionID) {
      const currentKeyboard = new InlineKeyboard();
      let allAnswers: string[] = [];

      allAnswers = allAnswers.concat(JSON.parse(question.answers));
      allAnswers.push(question.rightAnswer);
      allAnswers.sort();

      allAnswers[allAnswers.indexOf(answer)] += "✅";

      currentKeyboard.text(allAnswers[0]);
      currentKeyboard.text(allAnswers[1]).row();
      currentKeyboard.text(allAnswers[2]);
      currentKeyboard.text(allAnswers[3]);

      ctx.editMessageText(question.text, { reply_markup: currentKeyboard });

      const results = await db.getResultsByTheme(ctx.user.ID, question.theme);
      const time = results[0].answerTime;
      const all = results.length;
      let right = 0;
      for (let i in results) {
        if (results[i].correct) {
          right++;
        }
      }

      ctx.reply(
        `Hamma savollarga javob berdingiz\nto'g'ri javoblar: ${right}/${all}\njavob berilgan vaqti: ${time.toLocaleString()}`
      );
      return;
    }

    const nextQuestion = await db.getQuestionByID(nextQuestionID);
    if (!nextQuestion) return;
    const nextKeyboard = new InlineKeyboard();
    let nextAnswers: string[] = [];

    nextAnswers = nextAnswers.concat(JSON.parse(nextQuestion.answers));
    nextAnswers.push(nextQuestion.rightAnswer);
    nextAnswers.sort();

    nextKeyboard.text(
      nextAnswers[0],
      `answerTo_${nextQuestion.ID}_${nextAnswers[0]}`
    );
    nextKeyboard
      .text(nextAnswers[1], `answerTo_${nextQuestion.ID}_${nextAnswers[1]}`)
      .row();
    nextKeyboard.text(
      nextAnswers[2],
      `answerTo_${nextQuestion.ID}_${nextAnswers[2]}`
    );
    nextKeyboard.text(
      nextAnswers[3],
      `answerTo_${nextQuestion.ID}_${nextAnswers[3]}`
    );

    const currentKeyboard = new InlineKeyboard();
    let allAnswers: string[] = [];

    allAnswers = allAnswers.concat(JSON.parse(question.answers));
    allAnswers.push(question.rightAnswer);
    allAnswers.sort();

    allAnswers[allAnswers.indexOf(answer)] += "✅";

    currentKeyboard.text(allAnswers[0]);
    currentKeyboard.text(allAnswers[1]).row();
    currentKeyboard.text(allAnswers[2]);
    currentKeyboard.text(allAnswers[3]);

    ctx.editMessageText(question.text, { reply_markup: currentKeyboard });
    ctx.reply(nextQuestion.text, { reply_markup: nextKeyboard });
  }
});
