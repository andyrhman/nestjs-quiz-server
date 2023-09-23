import { CategoryService } from './../category/category.service';
import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Question } from './models/quiz.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { isUUID } from 'class-validator';

@Controller('quiz')
export class QuizController {
    constructor(
        private quizService: QuizService,
        private categoryService: CategoryService,
        private authService: AuthService,  // Inject the AuthService
    ) { }

    @Post(':id')
    async create(
        @Param('id') id: string,
        @Body() body: Question[]
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const category = await this.categoryService.findOne({id});
    
        if (!category) {
            throw new BadRequestException('No questions found');
        }
    
        const questions = body.map(question => ({
            ...question,
            category_id: category.id,
        }));
    
        return this.quizService.createQ(questions);
    }
    

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.quizService.findOne({ questionUuid: id, answered: false });
    }

    @Post(':id/answer')
    async answer(
        @Req() request: Request,
        @Param('id') id: string,
        @Query('page') page: number,
        @Body() answerData: { answer: string }) 
    {
        const category = await this.categoryService.findOne({id});
    
        if (!category) {
            throw new BadRequestException('No questions found');
        }
        const userId = await this.authService.userId(request);
        return this.quizService.answerQuestions(userId, id, page, answerData.answer);
    }

    //* Answering the question without pagination
    // @Post(':id/answer')
    // async answer(@Param('id') id: string, @Body() answers: { question_no: string, answer: string }[]) {
    //     return this.quizService.answerQuestions(id, answers);
    // }

}
