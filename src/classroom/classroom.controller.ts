import { Request } from 'express';
import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { isUUID } from 'class-validator';

@Controller('classroom')
export class ClassroomController {
    constructor(
        private classroomService: ClassroomService,
        private authService: AuthService,
        private userService: UserService
    ) { }

    // * Get all classrooms and the users
    @UseGuards(AuthGuard)
    @Get()
    async all() {
        return this.classroomService.all(['users']);
    }

    // * Create classroom and assign the users
    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Body() body: any
    ) {
        const checkClassroom = await this.classroomService.findOne({ name: body.name });

        if (checkClassroom) {
            throw new BadRequestException(`Classroom with the name '${body.name}' already exists`);
        };

        return this.classroomService.create({
            name: body.name,
            users: body.users.map((id: any) => {
                return {
                    id: id
                };
            })
        });
    }

    // * Assign a user to a specific classroom
    @UseGuards(AuthGuard)
    @Post(':classroomId/users')
    async assignUserToClassroom(
        @Param('classroomId') classroomId: string,
        @Body('user_id') user_id: string,
    ) {
        if (!isUUID(classroomId)) {
            throw new BadRequestException('Invalid UUID format');
        }
        
        const classroom = await this.classroomService.findOne({ id: classroomId }, ['users']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        const user = await this.userService.findOne({ id: user_id });

        if (user) {
            throw new BadRequestException('User already exists');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        classroom.users.push(user);

        return this.classroomService.create(classroom);
    }

    // * Get authenticated user clasroom
    @UseGuards(AuthGuard)
    @Get('user')
    async userClass(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        return this.userService.findOne({ id }, ['classrooms']);
    }
}
