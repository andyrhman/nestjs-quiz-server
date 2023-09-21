import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Question } from './models/quiz.entity';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService
    ) { }

    @Post()
    async create(@Body() questionData: Question[]) {
        return this.quizService.create(questionData);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.quizService.findOne({ questionUuid: id, answered: false });
    }

    @Post(':id/answer')
    async answer(@Param('id') id: string, @Query('page') page: number, @Body() answerData: { answer: string }) {
        return this.quizService.answerQuestions(id, page, answerData.answer);
    }
    
    //* Answering the question without pagination
    // @Post(':id/answer')
    // async answer(@Param('id') id: string, @Body() answers: { question_no: string, answer: string }[]) {
    //     return this.quizService.answerQuestions(id, answers);
    // }

}
