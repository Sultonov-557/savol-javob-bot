import * as fs from "fs";
import { Question } from "./entity/question.entity";
import { join } from "path";
import { User } from "./entity/user.entity";

const users: User[] = JSON.parse(fs.readFileSync(join(__dirname, "../../src/database/users.json")).toLocaleString());
const questions: Question[] = JSON.parse(fs.readFileSync(join(__dirname, "../../src/database/questions.json")).toLocaleString());

export function newQuestion(question: Question) {
	questions.push(question);
}

export function save() {
	fs.writeFileSync(join(__dirname, "../../src/database/questions.json"), JSON.stringify(questions, null, 4));
	fs.writeFileSync(join(__dirname, "../../src/database/users.json"), JSON.stringify(users, null, 4));
	console.log("saved");
}

setInterval(save, 1 * 1000 * 60);
