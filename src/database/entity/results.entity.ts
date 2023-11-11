export class Result {
  public questionID: number;
  public answerTime: Date;
  public correct: boolean;
  constructor(questionID: number, correct: boolean) {
    this.questionID = questionID;
    this.correct = correct;
    this.answerTime = new Date();
  }
}
