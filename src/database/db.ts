import { AppDataSource } from "../common/config/database.config";
import { Question } from "./entity/question.entity";
import { Result } from "./entity/results.entity";
import { User } from "./entity/user.entity";

AppDataSource.initialize();

const userRepo = AppDataSource.getRepository(User);
const questionRepo = AppDataSource.getRepository(Question);
const resultRepo = AppDataSource.getRepository(Result);

export async function getUser(ID: string) {
	return await userRepo.findOneBy({ ID });
}

export async function isAnswered(userID: string, questionID: number) {
	const user = await userRepo.findOne({ where: { ID: userID }, relations: ["results"] });
	console.log(user, userID, questionID);

	return user;
}

export async function getUsers() {
	return await userRepo.find();
}
export async function newUser(ID: string, name: string) {
	const user = userRepo.create({ ID, name });
	await userRepo.save(user);
	return user;
}

export async function getThemes(page: number, limit: number = 9) {
	const questions = await questionRepo.find({ take: limit, skip: limit * (page - 1) });

	const themes: string[] = [];
	for (let i of questions) {
		if (!themes.includes(i.theme)) {
			themes.push(i.theme);
		}
	}
	return themes;
}

export async function getAllThemes() {
	const questions = await questionRepo.find();

	const themes: string[] = [];
	for (let i of questions) {
		if (!themes.includes(i.theme)) {
			themes.push(i.theme);
		}
	}
	return themes;
}

export async function getAllThemesCount() {
	const questions = await questionRepo.find();

	const themes: string[] = [];
	for (let i of questions) {
		if (!themes.includes(i.theme)) {
			themes.push(i.theme);
		}
	}
	return themes;
}

export async function getQuestionsByTheme(theme: string, page: number, limit: number = 9) {
	return await questionRepo.find({ where: { theme }, skip: limit * (page - 1), take: limit });
}

export async function getAllQuestionsByTheme(theme: string) {
	return await questionRepo.find({ where: { theme } });
}

export async function getAllQuestionsCountByTheme(theme: string) {
	return await questionRepo.count({ where: { theme } });
}

export async function getQuestionByID(ID: number) {
	return await questionRepo.findOneBy({ ID });
}
export async function newQuestion(arg: { answers: string[]; rightAnswer: string; text: string; theme: string }) {
	const { answers, rightAnswer, theme, text } = arg;
	const question = questionRepo.create({ answers: JSON.stringify(answers), rightAnswer, text, theme });
	questionRepo.save(question);
}

export async function newResult(arg: { question: Question; answerTime: Date; correct: boolean }) {
	const { answerTime, correct, question } = arg;

	const result = resultRepo.create({ answerTime, correct, question });
	resultRepo.save(result);
}
