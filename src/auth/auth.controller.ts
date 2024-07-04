import { RegisterDto } from './validation/register.dto';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Put, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TokenService } from 'src/user/token.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@UseInterceptors(ClassSerializerInterceptor) // hide the password
@Controller()
export class AuthController {
    private readonly TOKEN_EXPIRATION = 1 * 60 * 1000;
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private jwtService: JwtService,
        private authService: AuthService,
        private eventEmiter: EventEmitter2,
        private mailerService: MailerService,
        private configService: ConfigService,
    ) { }

    @Post('register')
    async register(
        @Body() body: RegisterDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const {confirm_password, ...data} = body;
        
        if (body.password !== body.confirm_password) {
            throw new BadRequestException("Password do not match.");
        }

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

        const user = await this.userService.create({
            ...data,
            password: hashPassword,
            role: { id: "3" }
        });

        response.status(201);

        await this.eventEmiter.emit('user.created', user);
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
            throw new BadRequestException("Password is invalid");
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

        return { message: "Successfully logged in!" };
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        return this.userService.findOne({ id }, ['role']);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) response: Response
    ) {
        response.clearCookie('user_session');

        return {
            message: "success"
        };
    }

    // * Verify account
    @Put('verify/:token')
    async verify(
        @Param('token') token: string
    ) {
        const userToken = await this.tokenService.findByTokenExpiresAt(token);
        if (!userToken) {
            throw new NotFoundException('Invalid verify ID');
        }

        if (userToken.used) {
            throw new BadRequestException('Verify ID has already been used');
        }

        const user = await this.userService.findOne({ email: userToken.email, id: userToken.user_id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.is_verified) {
            throw new NotFoundException('Your account had already verified');
        }

        if (user.email !== userToken.email && user.id !== userToken.user_id) {
            throw new BadRequestException('Invalid Verify ID or email');
        }

        await this.tokenService.update(userToken.id, { used: true });
        await this.userService.update(user.id, { is_verified: true });

        return { message: 'Account verified successfully' };
    }

    // * Resend verify token
    @Post('verify')
    async resend(
        @Body('email') email: string
    ) {
        if (!email) {
            throw new BadRequestException("Provide your email address");
        }

        const user = await this.userService.findOne({ email: email });
        if (!user) {
            throw new BadRequestException("Email not found");
        }
        if (user.is_verified) {
            throw new NotFoundException('Your account has already verified');
        }
        const token = crypto.randomBytes(16).toString('hex');
        const tokenExpiresAt = Date.now() + this.TOKEN_EXPIRATION;

        // Save the reset token and expiration time
        await this.tokenService.create({
            token,
            email: user.email,
            user_id: user.id,
            expiresAt: tokenExpiresAt
        });

        const url = `${this.configService.get('ORIGIN_2')}/verify/${token}`;

        const name = user.fullName;

        // ? https://www.phind.com/agent?cache=clpqjretb0003ia07g9pc4v5a
        const templatePath = path.join(__dirname, '..', '..', 'common', 'templates', 'auth.hbs');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);

        const html = template({
            name,
            url
        });

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verify your email',
            html: html,
        });

        return user;
    }
}
