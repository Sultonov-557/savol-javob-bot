import * as fs from "fs";
import { Question } from "./entity/question.entity";
import { join } from "path";
import { User } from "./entity/user.entity";

const users: User[] = JSON.parse(fs.readFileSync(join(__dirname, "../../src/database/users.json")).toLocaleString());
const questions: Question[] = JSON.parse(
	fs.readFileSync(join(__dirname, "../../src/database/questions.json")).toLocaleString()
);

const themes: string[] = [];

for (let i of questions) {
	if (!themes.includes(i.theme)) {
		themes.push(i.theme);
	}
}

export function getThemes() {
	return themes;
}

export function getQuestionsByTheme(theme: string) {
	const themedQuestions: Question[] = [];
	for (let i of questions) {
		if (i.theme == theme) {
			themedQuestions.push(i);
		}
	}
	return themedQuestions;
}

export function getQuestionsByID(id: number) {
	for (let i of questions) {
		if (i.id == id) {
			return i;
		}
	}
}

export function newQuestion(question: Question) {
	if (!themes.includes(question.theme)) {
		themes.push(question.theme);
	}
	questions.push(question);
}

export function save() {
	fs.writeFileSync(join(__dirname, "../../src/database/questions.json"), JSON.stringify(questions, null, 4));
	fs.writeFileSync(join(__dirname, "../../src/database/users.json"), JSON.stringify(users, null, 4));
	console.log("saved");
}

setInterval(save, 1 * 1000 * 60);
