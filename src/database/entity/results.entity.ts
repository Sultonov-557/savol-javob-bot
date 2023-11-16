import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./question.entity";
import { User } from "./user.entity";

@Entity()
export class Result {
	@PrimaryGeneratedColumn()
	public ID: number;

	@ManyToOne(() => Question, (question) => question.ID)
	@JoinTable()
	public question: Question;

	@ManyToOne(() => User, (user) => user.ID)
	@JoinTable()
	public user: User;

	@Column()
	public answerTime: Date;

	@Column()
	public correct: boolean;
}
