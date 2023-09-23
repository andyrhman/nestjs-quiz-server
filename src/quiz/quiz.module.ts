import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/quiz.entity';
import { Score } from './models/score.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { UserQuestion } from './models/answered.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Score, UserQuestion]),
    AuthModule,
    CategoryModule
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: []
})
export class QuizModule { }
