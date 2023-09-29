import { CategoryService } from './../category/category.service';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Question } from './models/quiz.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import { QuestionDTO } from './validation/quiz-create.dto';
import { TimeLimit } from './models/time.entity';

@Controller('quiz')
export class QuizController {
    constructor(
        private quizService: QuizService,
        private categoryService: CategoryService,
        private authService: AuthService,  // Inject the AuthService
    ) { }

    // * Get all questions and it relasions with category
    @Get()
    async all() {
        return this.quizService.all(['category'])
    }

    // * Create multiple questions
    @Post(':id')
    async create(
        @Param('id') id: string,
        @Body() body: { time_limit: number, questions: Question[] }
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const category = await this.categoryService.findOne({ id });

        if (!category) {
            throw new BadRequestException('No questions found');
        }
        let questions = [];
        let timeLimit = new TimeLimit();
        timeLimit.time_limit = body.time_limit;
        timeLimit.category_id = category.id;
        timeLimit.category = category;

        for (let i = 0; i < body.questions.length; i++) {
            let question = {
                ...body.questions[i],
                category_id: category.id,
            };
            questions.push(question);
        }

        await this.quizService.createTimeLimit(timeLimit);
        return this.quizService.createQ(questions);
    }

    @Post('one/:id')
    async CreateOne(
        @Param('id') id: string,
        @Body() body: QuestionDTO
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const category = await this.categoryService.findOne({ id });

        if (!category) {
            throw new BadRequestException('No questions found');
        }

        return this.quizService.create({
            ...body,
            category_id: category.id
        });
    }

    // * Get questions by the category
    @Get(':category')
    async findOne(
        @Param('category') category: string,
        @Query('page') page: number = 1
    ) {
        if (!isUUID(category)) {
            throw new BadRequestException();
        }

        const find = await this.quizService.showQuestion({ category_id: category }, page);

        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // * Start the countdown and show the questions
    @Post('start-timer/:id')
    async startTimer(
        @Req() request: Request,
        @Param('id') id: string,
        @Query('page') page: number = 1
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException();
        }
        const userId = await this.authService.userId(request);

        const find = await this.quizService.showQuestion({ category_id: id }, page);

        if (!find) {
            throw new NotFoundException();
        }

        await this.quizService.startTimer(userId, id);

        return find;
    }

    // * Find the timer by the category
    @Get('get-timer/:id')
    async getTimer(
        @Param('id') id: string
    ){
        return this.quizService.findTimerByCategory({category_id: id}, ['category'])
    }

    //* Answering the question without pagination
    @Post(':id/answer')
    async answer(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() answers: { question_no: string, answer: string }[]
    ) {
        const category = await this.categoryService.findOne({ id });

        if (!category) {
            throw new BadRequestException('No questions found');
        }
        const userId = await this.authService.userId(request);
        return this.quizService.answerQuestions(userId, id, answers);
    }

    @Put(':id/:category')
    async update(
        @Param('id') id: string,
        @Param('category') category: string,
        @Body() body: Question
    ) {
        if (!isUUID(category)) {
            throw new BadRequestException();
        }

        const find = await this.quizService.findOne({ id: id, category_id: category });

        if (!find) {
            throw new NotFoundException();
        }

        await this.quizService.update(id, body);

        return this.quizService.findOne({ id: id, category_id: category });
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number
    ) {
        return this.quizService.deleteQ(id);
    }

    // * Answer the questions
    // @Post(':id/answer')
    // async answer(
    //     @Req() request: Request,
    //     @Param('id') id: string,
    //     @Query('page') page: number,
    //     @Body() answerData: { answer: string }) {
    //     const category = await this.categoryService.findOne({ id });

    //     if (!category) {
    //         throw new BadRequestException('No questions found');
    //     }
    //     const userId = await this.authService.userId(request);
    //     return this.quizService.answerQuestions(userId, id, page, answerData.answer);
    // }

}
