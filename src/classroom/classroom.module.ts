import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom } from './models/classroom.entity';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserClassroom } from './models/user-classroom.entity';
import { UserClassroomService } from './userclassroom.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classroom, UserClassroom]),
    CommonModule,
    AuthModule,
    UserModule
  ],
  providers: [ClassroomService, UserClassroomService],
  controllers: [ClassroomController]
})
export class ClassroomModule {}
