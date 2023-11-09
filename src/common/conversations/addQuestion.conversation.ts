import { NewConversation } from "../types/Conversation.type";
import { NewContext } from "../types/Context.type";
import { Question } from "../../database/entity/question.entity";
import { newQuestion } from "../../database/db";

export async function addQuestion(conversation: NewConversation, ctx: NewContext) {
	//title
	ctx.reply("savol mavzusini yuboring");
	const title = await conversation.form.text();

	//question
	ctx.reply("savolni yuboring");
	const text = await conversation.form.text();

	//question right answer
	ctx.reply("tog'ri javobni yuboring");
	const rightAnswer = await conversation.form.text();

	//answers
	const answers: string[] = [];
	for (let i = 0; i < 3; ) {
		ctx.reply(`${i + 1}inichi javobni yuboring`);

		const answer = await conversation.form.text();

		if (answers.includes(answer) || rightAnswer == answer) {
			ctx.reply("bu javob allaqachon mavjud");
		} else {
			answers.push(answer);
			i++;
		}
	}
	const question = new Question(Date.now(), title, text, answers, rightAnswer);
	newQuestion(question);
}
