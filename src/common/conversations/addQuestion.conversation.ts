import { NewConversation } from "../types/Conversation.type";
import { NewContext } from "../types/Context.type";
import { Question } from "../../database/entity/question.entity";
import { newQuestion } from "../../database/db";

export async function addQuestion(
  conversation: NewConversation,
  ctx: NewContext
) {
  //theme
  ctx.reply("Savol mavzusini yuboring");
  const theme = await conversation.form.text();

  //question
  ctx.reply("Savolni yuboring");
  const text = await conversation.form.text();

  //question right answer
  ctx.reply("Tog'ri javobni yuboring");
  const rightAnswer = await conversation.form.text();

  //answers
  const answers: string[] = [];
  for (let i = 0; i < 3; ) {
    ctx.reply(`${i + 1}inichi javobni yuboring`);

    const answer = await conversation.form.text();

    if (answers.includes(answer) || rightAnswer == answer) {
      ctx.reply("Bu javob allaqachon mavjud");
    } else {
      answers.push(answer);
      i++;
    }
  }

  await newQuestion({ answers, rightAnswer, text, theme });
  ctx.reply("yangi savol qoshildi");
}
