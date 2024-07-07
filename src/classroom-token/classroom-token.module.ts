import { Module } from '@nestjs/common';
import { ClassroomTokenService } from './classroom-token.service';
import { ClassroomTokenController } from './classroom-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomToken } from './models/classroom-token.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomToken]),
    CommonModule,
    AuthModule,
    UserModule
  ],
  providers: [ClassroomTokenService],
  controllers: [ClassroomTokenController],
  exports: [ClassroomTokenService]
})
export class ClassroomTokenModule {}
