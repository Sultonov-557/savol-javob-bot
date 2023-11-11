import { Result } from "./results.entity";

export class User {
  public id: number;
  public name: string;
  public score: number;
  public results: Result[];
  constructor(id: number, name: string, score: number) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.results = [];
  }
}
