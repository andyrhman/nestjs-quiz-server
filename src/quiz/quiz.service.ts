import { BadRequestException, Injectable } from '@nestjs/common';
import { Question } from './models/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './models/score.entity';
import { AbstractService } from 'src/common/abstract.service';
import { UserQuestion } from './models/answered.entity';

@Injectable()
export class QuizService extends AbstractService {
    constructor(
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
        @InjectRepository(UserQuestion) private readonly userQuestionRepository: Repository<UserQuestion>,
    ) {
        super(questionRepository)
    }

    async createQ(data: Question[]): Promise<any> {
        return this.questionRepository.save(data);
    }

    // * THE CODE FOR THIS IS IN THE THIRD LAST ANSWER FOR THE PAGINATION ANSWER
    // ? https://www.phind.com/search?cache=fmobdk450n4mc8h59x63tqud

    // * THE CODE FOR TO KEEP TRACK WHETERH THE USER HAS ANSWERED THE QUESTION OR NOT
    // ? https://www.phind.com/search?cache=xw1i7ijdug6q25tysmf54fo3
    async answerQuestions(userId: string, uuid: string, page: number, answer: string): Promise<any> {
        let score = await this.scoreRepository.findOne({ where: { category_id: uuid, user_id: userId } });
        if (!score) {
            score = this.scoreRepository.create();
            score.category_id = uuid;
            score.user_id = userId;
            score = await this.scoreRepository.save(score);
        }
        if (score.completed) {
            throw new BadRequestException('Questions already answered');
        }

        score.user_id = userId; // Assign userId to the score
        await this.scoreRepository.save(score);

        // Fetch the question for the given page number
        const question = await this.questionRepository.findOne({
            where: { category_id: uuid, question_no: String(page) }
        });

        if (!question) {
            throw new BadRequestException('No more questions');
        }

        // Check if the user has already answered this question
        const userQuestion = await this.userQuestionRepository.findOne({
            where: { user_id: userId, question_id: question.id }
        });

        if (userQuestion && userQuestion.answered) {
            throw new BadRequestException('Question already answered');
        }

        // Check answer and update score and UserQuestion
        if (question.correctAnswer === answer) {
            score.score += 10;
            score = await this.scoreRepository.save(score); // Save the score immediately after updating it
        }

        if (!userQuestion) {
            // Create a new UserQuestion entry if it doesn't exist
            const newUserQuestion = this.userQuestionRepository.create();
            newUserQuestion.user_id = userId;
            newUserQuestion.question_id = question.id;
            newUserQuestion.answered = true;
            await this.userQuestionRepository.save(newUserQuestion);
        } else {
            // Update the UserQuestion entry if it exists
            userQuestion.answered = true;
            await this.userQuestionRepository.save(userQuestion);
        }

        const remainingQuestions = await this.questionRepository.count();
        const answeredQuestions = await this.userQuestionRepository.count({ where: { user_id: userId, answered: true } });

        if (remainingQuestions === answeredQuestions) {
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
