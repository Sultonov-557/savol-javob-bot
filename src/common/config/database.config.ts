import { DataSource } from "typeorm";
import { Question } from "../../database/entity/question.entity";
import { User } from "../../database/entity/user.entity";
import { Result } from "../../database/entity/results.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  username: "root",
  password: "root",
  database: "savoljavobbot",
  port: 3000,
  synchronize: true,
  entities: [Question, User, Result],
});
