import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { TokenService } from './token.service';
import { UserController } from './user.controller';
import { Token } from './models/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
  ],
  providers: [UserService, TokenService],
  controllers: [UserController],
  exports: [UserService, TokenService]
})
export class UserModule {}
