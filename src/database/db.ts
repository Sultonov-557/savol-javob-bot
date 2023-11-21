import { Not } from "typeorm";
import { AppDataSource } from "../common/config/database.config";
import { Question } from "./entity/question.entity";
import { Result } from "./entity/results.entity";
import { User } from "./entity/user.entity";

AppDataSource.initialize();

const userRepo = AppDataSource.getRepository(User);
const questionRepo = AppDataSource.getRepository(Question);
const resultRepo = AppDataSource.getRepository(Result);

export async function getUser(ID: string) {
  return await userRepo.findOne({
    where: { ID },
    relations: ["results", "results.question"],
  });
}

export async function isAnswered(userID: string, questionID: number) {
  const user = await userRepo.exist({
    where: { ID: userID, results: { question: { ID: questionID } } },
    relations: ["results"],
  });
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
  const questions = await questionRepo.find({
    take: limit,
    skip: limit * (page - 1),
  });

  const themes: string[] = [];
  for (let i of questions) {
    if (!themes.includes(i.theme)) {
      themes.push(i.theme);
    }
  }
  return themes;
}

export async function getNextQuestion(
  user: User,
  theme: string,
  currentQuestionID?: number
) {
  const questions = await questionRepo.find({ where: { theme: theme } });
  const results = await resultRepo.find({
    where: { user: { ID: user.ID } },
    relations: ["user", "question"],
  });
  let list: number[] = questions.map((v) => {
    return v.ID;
  });

  if (currentQuestionID) {
    list.splice(list.indexOf(currentQuestionID), 1);
  }

  for (let i in results) {
    const result = results[i];
    list = list.filter((v) => {
      if (result.question.ID == v) {
        return false;
      } else {
        return true;
      }
    });
  }
  if (list.length != 0) {
    return list[0];
  } else {
    return undefined;
  }
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

export async function getQuestionsByTheme(
  theme: string,
  page: number,
  limit: number = 9
) {
  return await questionRepo.find({
    where: { theme },
    skip: limit * (page - 1),
    take: limit,
  });
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

export async function getResultsByTheme(userID: string, theme: string) {
  return await resultRepo.find({
    where: { question: { theme }, user: { ID: userID } },
    relations: ["question", "user"],
  });
}

export async function saveUser(user: User) {
  await userRepo.save(user);
}

export async function newQuestion(arg: {
  answers: string[];
  rightAnswer: string;
  text: string;
  theme: string;
}) {
  const { answers, rightAnswer, theme, text } = arg;
  const question = questionRepo.create({
    answers: JSON.stringify(answers),
    rightAnswer,
    text,
    theme,
  });
  questionRepo.save(question);
}

export async function newResult(arg: {
  user: User;
  question: Question;
  answerTime: Date;
  correct: boolean;
}) {
  const { answerTime, correct, question, user } = arg;

  const result = resultRepo.create({ answerTime, correct, question, user });
  resultRepo.save(result);
}
