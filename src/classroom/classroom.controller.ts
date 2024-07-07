import { Request } from 'express';
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { isUUID } from 'class-validator';
import { ClassroomCreateDto } from './dto/create-classroom.dto';
import { ClassroomTokenService } from 'src/classroom-token/classroom-token.service';

@Controller('classroom')
export class ClassroomController {
    constructor(
        private classroomService: ClassroomService,
        private authService: AuthService,
        private userService: UserService,
        private classroomTokenServie: ClassroomTokenService
    ) { }

    // * Get all classrooms and the users
    @UseGuards(AuthGuard)
    @Get()
    async all() {
        return this.classroomService.all(['users']);
    }

    // * Create classroom
    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Body() body: ClassroomCreateDto,
        @Req() request: Request
    ) {
        const userId = await this.authService.userId(request);
        const checkClassroom = await this.classroomService.findOne({ name: body.name });

        if (checkClassroom) {
            throw new BadRequestException(`Classroom with the name '${body.name}' already exists`);
        };

        const classroom = await this.classroomService.create({
            ...body,
            user_teacher: userId
        });

        // Generate and save the classroom token
        const classroomToken = await this.classroomTokenServie.create({
            key: this.classroomService.generateToken(6),
            classroom_id: classroom.id,
        });

        return { classroom, classroomToken };
    }

    // * Assign a user to a specific classroom
    @UseGuards(AuthGuard)
    @Post(':classroomId/users')
    async assignUserToClassroom(
        @Param('classroomId') classroomId: string,
        @Body('user_id') user_id: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId)) {
            throw new BadRequestException('Invalid UUID format');
        }   
        const teacher = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['users']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        if (classroom.user_teacher !== teacher) {
            throw new ForbiddenException();
        }

        const user = await this.userService.findOne({ id: user_id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // * Check if the user is already assigned to the classroom
        const userAlreadyInClassroom = classroom.users.some((existingUser: any) => existingUser.id === user_id);

        if (userAlreadyInClassroom) {
            throw new BadRequestException('User is already assigned to this classroom');
        }

        classroom.users.push(user);

        return this.classroomService.create(classroom);
    }

    // * Remove a user from a specific classroom
    @UseGuards(AuthGuard)
    @Delete(':classroomId/users/:userId')
    async removeUserFromClassroom(
        @Param('classroomId') classroomId: string,
        @Param('userId') userId: string,
    ) {
        if (!isUUID(classroomId) || !isUUID(userId)) {
            throw new BadRequestException('Invalid UUID format');
        }

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['users']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Check user 
        const userIndex = classroom.users.findIndex(existingUser => existingUser.id === userId);

        if (userIndex === -1) {
            throw new NotFoundException('User not found in this classroom');
        }

        // * Remove user
        classroom.users.splice(userIndex, 1);

        // * Update table
        await this.classroomService.create(classroom);

        return { message: 'User removed from classroom successfully' };
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
