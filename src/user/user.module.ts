import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { TokenService } from './token.service';
import { UserController } from './user.controller';
import { Token } from './models/token.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from 'src/role/role.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    forwardRef(() => AuthModule),
    RoleModule
  ],
  providers: [UserService, TokenService],
  controllers: [UserController],
  exports: [UserService, TokenService]
})
export class UserModule {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

}
