import { Module } from '@nestjs/common';
import { ClassroomSessionService } from './classroom-session.service';
import { ClassroomSessionController } from './classroom-session.controller';
import { ClassroomSession } from "src/classroom-session/models/classroom-session.models";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomSession]),
    CommonModule
  ],
  providers: [ClassroomSessionService],
  controllers: [ClassroomSessionController],
  exports: [ClassroomSessionService]
})
export class ClassroomSessionModule {}
