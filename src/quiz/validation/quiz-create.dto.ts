import { IsNotEmpty, IsString } from "class-validator";

export class QuestionDTO{
    @IsString()
    @IsNotEmpty({message: "Question number is required..."})
    question_no: string;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    opt1: string;

    @IsString()
    @IsNotEmpty()
    opt2: string;

    @IsString()
    @IsNotEmpty()
    opt3: string;

    @IsString()
    @IsNotEmpty()
    opt4: string;

    @IsString()
    @IsNotEmpty()
    correctAnswer: string;

}
