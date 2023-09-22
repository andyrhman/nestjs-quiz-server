import { registerDTO } from './validation/register.dto';
import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import * as argon2 from 'argon2';
import { JoiValidationPipe } from 'src/common/validation.pipe';

@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) { }

    @Post('register')
    async register(
        @Body(new JoiValidationPipe(registerDTO)) body: any,
        @Res({ passthrough: true }) response: Response
    ) {
        const existingEmail = await this.userService.findOne({email: body.email});

        if (existingEmail) {
            throw new BadRequestException('Email already exists');
        }

        const existingUsername = await this.userService.findOne({username: body.username});

        if (existingUsername) {
            throw new BadRequestException('Username already exists');
        }

        // Hash Password
        const hashPassword = await argon2.hash(body.password);

        response.status(200);
        return this.userService.create({
            fullname: body.fullname,
            username: body.username,
            email: body.email,
            password: hashPassword,
        });
    }

    
}
