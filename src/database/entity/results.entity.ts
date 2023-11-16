import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Result {
	@PrimaryGeneratedColumn()
	public ID: number;

	@ManyToMany(() => Question)
	@JoinTable()
	public question: Question;

	@Column()
	public answerTime: Date;

	@Column()
	public correct: boolean;
}
