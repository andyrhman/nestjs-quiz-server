import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom } from './models/classroom.entity';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ClassroomTokenModule } from 'src/classroom-token/classroom-token.module';
import { UploadController } from './classroom-upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classroom]),
    CommonModule,
    AuthModule,
    UserModule,
    ClassroomTokenModule
  ],
  providers: [ClassroomService],
  controllers: [ClassroomController, UploadController]
})
export class ClassroomModule {}
