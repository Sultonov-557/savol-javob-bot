export class Question {
	public id: number;
	public theme: string;
	public text: string;
	public answers: string[];
	public rightAnswer: string;
	constructor(id: number, text: string, answers: string[], rightAnswer: string, theme: string) {
		this.id = id;
		this.text = text;
		this.answers = answers;
		this.rightAnswer = rightAnswer;
		this.theme = theme.toLowerCase();
	}
}
