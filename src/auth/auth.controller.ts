import { registerDTO } from './validation/register.dto';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import * as argon2 from 'argon2';
import { JoiValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor) // hide the password
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
        const existingEmail = await this.userService.findOne({ email: body.email });

        if (existingEmail) {
            throw new BadRequestException('Email already exists');
        }

        const existingUsername = await this.userService.findOne({ username: body.username });

        if (existingUsername) {
            throw new BadRequestException('Username already exists');
        }

        // Hash Password
        const hashPassword = await argon2.hash(body.password);

        response.status(200);
        await this.userService.create({
            fullname: body.fullname,
            username: body.username,
            email: body.email,
            password: hashPassword,
        });

        return{
            message: "Account successfully created"
        };
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response,
        @Body('rememberMe') rememberMe?: boolean
    ) {
        let user;

        // Check whether to find the user by email or username based on input.
        if (email) {
            user = await this.userService.findOne({ email: email });
        } else {
            user = await this.userService.findOne({ username: username });
        }

        // If user doesn't exist, throw a BadRequestException indicating invalid credentials.
        if (!user) {
            throw new BadRequestException('Username or Email is Invalid');
        }

        if (!await argon2.verify(user.password, password)) {
            throw new BadRequestException("Password is invalid")
        }

        // Calculate the expiration time for the refresh token
        // Generate a refresh token using the JWT service with the calculated expiration time.
        const refreshTokenExpiration = rememberMe
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds

        const jwt = await this.jwtService.signAsync({ id: user.id });

        response.cookie('user_session', jwt, {
            httpOnly: true,
            expires: refreshTokenExpiration,
        });
        response.status(200);

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        return this.userService.findOne({ id });
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) response: Response
    ) {
        response.clearCookie('user_session');

        return {
            message: "success"
        }
    }
}
