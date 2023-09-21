import { BadRequestException, Injectable } from '@nestjs/common';
import { Question } from './models/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './models/score.entity';

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>
    ) { }

    async create(questionData: Question[]): Promise<any> {
        const score = this.scoreRepository.create();
        score.questionUuid = questionData[0].questionUuid;
        const savedScore = await this.scoreRepository.save(score);

        for (const question of questionData) {
            question.score = savedScore;
        }

        return this.questionRepository.save(questionData);
    }

    async findOne(options): Promise<Question | null> {
        return this.questionRepository.findOne(options);
    }

    // * THE CODE FOR THIS IS IN THE SECOND LAST ANSWER
    // ? https://www.phind.com/search?cache=fmobdk450n4mc8h59x63tqud
    async answerQuestions(uuid: string, page: number, answer: string): Promise<any> {
        let score = await this.scoreRepository.findOne({ where: { questionUuid: uuid } });
        if (!score) {
            throw new BadRequestException('Score not found');
        }
        if (score.completed) {
            throw new BadRequestException('Questions already answered');
        }

        // Fetch the question for the given page number
        const question = await this.questionRepository.findOne({
            where: { questionUuid: uuid, question_no: String(page), answered: false }
        });

        if (!question) {
            throw new BadRequestException('No more questions');
        }

        // Check answer and update score and question
        if (question.correctAnswer === answer) {
            score.score += 10;
            score = await this.scoreRepository.save(score); // Save the score immediately after updating it
        }
        question.answered = true;
        await this.questionRepository.save(question);

        const remainingQuestions = await this.questionRepository.count({ where: { score, answered: false } });
        if (remainingQuestions === 0) {
            score.completed = true;
            score = await this.scoreRepository.save(score); // Save the score immediately after marking it as completed
        }

        return { score: score.score, completed: score.completed };
    }

    //* Annswering the question with pagination
    // async answerQuestions(uuid: string, page: number, answer: string): Promise<any> {
    //     let score = await this.scoreRepository.findOne({ where: { questionUuid: uuid } });
    //     if (!score) {
    //         throw new BadRequestException('Score not found');
    //     }
    //     if (score.completed) {
    //         throw new BadRequestException('Questions already answered');
    //     }

    //     // Fetch the question for the given page number
    //     const question = await this.questionRepository.findOne({
    //         where: { questionUuid: uuid, question_no: String(page), answered: false }
    //     });

    //     if (!question) {
    //         throw new BadRequestException('No more questions');
    //     }

    //     // Check answer and update score and question
    //     if (question.correctAnswer === answer) {
    //         score.score += 10;
    //         score = await this.scoreRepository.save(score); // Save the score immediately after updating it
    //     }
    //     question.answered = true;
    //     await this.questionRepository.save(question);

    //     const remainingQuestions = await this.questionRepository.count({ where: { score, answered: false } });
    //     if (remainingQuestions === 0) {
    //         score.completed = true;
    //         score = await this.scoreRepository.save(score); // Save the score immediately after marking it as completed
    //     }

    //     return { score: score.score, completed: score.completed };
    // }

    //* Answering the question without pagination
    // async answerQuestions(uuid: string, answers: { question_no: string, answer: string }[]): Promise<any> {
    //     const score = await this.scoreRepository.findOne({ where: { questionUuid: uuid } });
    //     if (!score) {
    //         throw new BadRequestException('Score not found');
    //     }
    //     if (score.completed) {
    //         throw new BadRequestException('Questions already answered');
    //     }
    //     for (const ans of answers) {
    //         const question = await this.questionRepository.findOne({ where: { questionUuid: uuid, question_no: ans.question_no, answered: false } });
    //         if (question) {
    //             if (question.correctAnswer === ans.answer) {
    //                 score.score += 10;
    //             }
    //             question.answered = true;
    //             await this.questionRepository.save(question);

    //             const remainingQuestions = await this.questionRepository.count({ where: { score, answered: false } });
    //             if (remainingQuestions === 0) {
    //                 score.completed = true;
    //             }
    //         }
    //     }
    //     await this.scoreRepository.save(score);
    //     return score;
    // }


}
