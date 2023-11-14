import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  public ID: number;

  @OneToOne(() => Question)
  @JoinColumn()
  public question: Question;

  @Column()
  public answerTime: Date;

  @Column()
  public correct: boolean;
}
