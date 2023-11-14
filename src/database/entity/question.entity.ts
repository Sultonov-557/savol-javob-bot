import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  public ID: number;

  @Column()
  public theme: string;

  @Column()
  public text: string;

  @Column()
  public answers: string;

  @Column()
  public rightAnswer: string;
}
