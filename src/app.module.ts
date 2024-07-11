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
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ClassroomTokenModule } from './classroom-token/classroom-token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission/permission.guard';
import { OrderModule } from './order/order.module';

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
    MailerModule.forRoot({
      transport: {
        // * Let docker know nodemailer run in local.
        // ? https://www.phind.com/search?cache=rrc34g0tz9oxk331skvds3di
        host: 'host.docker.internal',
        port: 1025,
      },
      defaults: {
        from: 'service@mail.com'
      }
    }),
    EventEmitterModule.forRoot(),
    QuizModule,
    UserModule,
    CommonModule,
    AuthModule,
    CategoryModule,
    ClassroomModule,
    ClassroomSessionModule,
    RoleModule,
    PermissionModule,
    ClassroomTokenModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ]
})
export class AppModule { }
