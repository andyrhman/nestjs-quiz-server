import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/quiz.entity';
import { Score } from './models/score.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { UserQuestion } from './models/answered.entity';
import { TimeLimit } from './models/time.entity';
import { UserQuestionTimer } from './models/user-timer.entity';
import { UserModule } from 'src/user/user.module';
import { ScoreService } from './score.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Score, UserQuestion, TimeLimit, UserQuestionTimer]),
    AuthModule,
    CategoryModule,
    UserModule
  ],
  controllers: [QuizController],
  providers: [QuizService, ScoreService],
  exports: []
})
export class QuizModule { }
