import { Category } from "src/category/models/category.entity";
import { Score } from "./score.entity";

export class Question {
    id?: string;
    question_no: string;
    question: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    correctAnswer: string;
    score?: Score;
    answered?: boolean;
    category?: Category;
}
