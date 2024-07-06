import { BadRequestException, Body, ClassSerializerInterceptor, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleService } from 'src/role/role.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from './models/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from 'src/permission/decorator/permission.decorator';
import { UserCreateDto } from './dto/user-create.dto';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import * as argon2 from 'argon2';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private authService: AuthService
    ) { }

    @Get('userf')
    async findUsersRegister(@Query('search') search: string): Promise<User[]> {
        // Check for malicious characters in the search input
        if (/[<>]/.test(search)) {
            throw new BadRequestException("Invalid user input");
        }

        const users = await this.userService.findUsersRegister(search);

        if (users.length === 0) {
            throw new NotFoundException(`Can't find any results for your search: ${search}`);
        }

        return users;
    }

    @Get()
    @UseGuards(AuthGuard)
    @HasPermission('users')
    async all(@Query('page') page: number = 1) {
        return await this.userService.paginate(page, ['role']);
    }

    @Post()
    @UseGuards(AuthGuard)
    @HasPermission('users')
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await argon2.hash('123456');

        // Check if the username or email already exists
        const existingUser = await this.userService.findByUsernameOrEmail(
            body.username,
            body.email,
        );

        if (existingUser) {
            throw new BadRequestException('Username or email already exists');
        }

        return this.userService.create({
            username: body.username,
            email: body.email,
            password,
            role: { id: body.role_id }
        });
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @HasPermission('users')
    async get(@Param('id') id: string) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }

        const search = await this.userService.findOne({ id }, ['role']);

        if (!search) {
            throw new NotFoundException('User not found');
        }

        return search;
    }

    // User update their own info
    @Put('info')
    @UseGuards(AuthGuard)
    async updateInfo(
        @Req() request: Request,
        @Body() body: any,
    ) {
        const id = await this.authService.userId(request);
        const existingUser = await this.userService.findOne({ id });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        if (body.email && body.email !== existingUser.email) {
            const existingUserByEmail = await this.userService.findByEmail(body.email);
            if (existingUserByEmail) {
                throw new ConflictException('Email already exists');
            }
            existingUser.email = body.email;
        }

        if (body.username && body.username !== existingUser.username) {
            const existingUserByUsername = await this.userService.findByUsername(body.username);
            if (existingUserByUsername) {
                throw new ConflictException('Username already exists');
            }
            existingUser.username = body.username;
        }

        await this.userService.update(id, existingUser);

        return this.userService.findOne({ id });
    }

    // User update their own password
    @Put('password')
    @UseGuards(AuthGuard)
    async updatePassword(
        @Req() request: Request,
        @Body() body: any,
    ) {
        if (body.password !== body.confirm_password) {
            throw new BadRequestException("Password do not match.");
        }

        const id = await this.authService.userId(request);

        const hashPassword = await argon2.hash(body.password);

        await this.userService.update(id, {
            password: hashPassword
        });

        return this.userService.findOne({ id });
    }

    // * Admin update the user info
    @Put(':id')
    @UseGuards(AuthGuard)
    @HasPermission('users')
    async update(
        @Param('id') id: string,
        @Body() body: any,
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }

        const existingUser = await this.userService.findOne({ id });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const { username, email, role_id } = body;

        // Check if username already exists and is different from the existing one
        if (username && username !== existingUser.username) {
            const existingUsername = await this.userService.findByUsername(username);
            if (existingUsername) {
                throw new BadRequestException('Username already exists');
            }
            existingUser.username = username;
        }

        // Check if email already exists and is different from the existing one
        if (email && email !== existingUser.email) {
            const existingEmail = await this.userService.findByEmail(email);
            if (existingEmail) {
                throw new BadRequestException('Email already exists');
            }
            existingUser.email = email;
        }

        // Update the role if role_id is provided
        if (role_id) {
            const role = await this.roleService.findOne({ id: role_id });
            if (!role) {
                throw new NotFoundException('Role not found');
            }
            existingUser.role = role;
        }

        // Perform the update
        await this.userService.update(id, existingUser);

        return this.userService.findOne({ id });
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @HasPermission('users')
    async delete(
        @Param('id') id: string,
    ) {
        await this.userService.delete(id);

        return {
            message: "User deleted sucessfully"
        }
    }
}
