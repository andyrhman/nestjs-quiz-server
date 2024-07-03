import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { ConfigurationModule } from 'config/config.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ClassroomModule } from './classroom/classroom.module';
import { ClassroomSessionModule } from './classroom-session/classroom-session.module';

@Module({
  imports: [
    ConfigurationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      // entities: [],
      autoLoadEntities: true, //delete if production
      synchronize: true,
    }),
    QuizModule,
    UserModule,
    CommonModule,
    AuthModule,
    CategoryModule,
    ClassroomModule,
    ClassroomSessionModule,
  ],
})
export class AppModule {}
