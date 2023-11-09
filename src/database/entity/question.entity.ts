export class Question {
	public id: number;
	public title: string;
	public text: string;
	public answers: string[];
	public rightAnswer: string;
	constructor(id: number, title: string, text: string, answers: string[], rightAnswer: string) {
		this.id = id;
		this.title = title;
		this.text = text;
		this.answers = answers;
		this.rightAnswer = rightAnswer;
	}
}
