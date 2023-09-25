import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom } from './models/classroom.entity';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserClassroom } from './models/user-classroom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classroom, UserClassroom]),
    CommonModule,
    AuthModule
  ],
  providers: [ClassroomService],
  controllers: [ClassroomController]
})
export class ClassroomModule {}
