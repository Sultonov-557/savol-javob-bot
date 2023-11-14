import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Result } from "./results.entity";

@Entity()
export class User {
  @PrimaryColumn()
  ID: string;

  @Column()
  public name: string;

  @Column({ default: 0 })
  public score: number;

  @OneToMany(
    () => Result,
    (result) => {
      result.ID;
    }
  )
  @JoinColumn()
  public results: Result[];
}
