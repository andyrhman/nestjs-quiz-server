import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/quiz.entity';
import { Score } from './models/score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Score])
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: []
})
export class QuizModule { }
