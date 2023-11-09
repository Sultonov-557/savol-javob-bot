export class User {
  public id: number;
  public name: string;
  public score: number;
  constructor(id: number, name: string, score: number) {
    this.id = id;
    this.name = name;
    this.score = score;
  }
}
