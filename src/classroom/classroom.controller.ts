import { Request } from 'express';
import { BadRequestException, Body, ClassSerializerInterceptor, ConflictException, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { isUUID } from 'class-validator';
import { ClassroomCreateDto } from './dto/create-classroom.dto';
import { ClassroomTokenService } from 'src/classroom-token/classroom-token.service';
import { ConfigService } from '@nestjs/config';
import { ClassroomUpdateDto } from './dto/update-classroom.dto';

// ! TODO
/* 
    ! Show token key only for teacher
    ! Student request for joining classroom
    
    ! show students inside classroom
    ! show student completion status
    ! Add classroom review & rating
    ! Create classroom categories
    ! Create classroom learning path

    ? Add classroom picture 
    ? Add classroom level difficulty
    ? Add classroom study time estimation

*/

@UseInterceptors(ClassSerializerInterceptor)
@Controller('classroom')
export class ClassroomController {
    constructor(
        private classroomService: ClassroomService,
        private authService: AuthService,
        private userService: UserService,
        private classroomTokenServie: ClassroomTokenService,
        private configService: ConfigService
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

        if (!body.picture) {
            body.picture = `${this.configService.get('SERVER')}classroom/uploads/default-class.jpg`;
        }

        // * Insert multiple teachers
        let teachers = [];
        if (body.teachers) {
            teachers = body.teachers.map((id) => ({ id }));
        }

        // * Insert multiple students
        let students = [];
        if (body.students) {
            students = body.students.map((id) => ({ id }));
        }

        const classroom = await this.classroomService.create({
            ...body,
            teachers: [...teachers, { id: userId }], // Add the current user as a teacher
            students: [...students],
        });

        // Generate and save the classroom token
        const classroomToken = await this.classroomTokenServie.create({
            key: this.classroomService.generateToken(6),
            classroom_id: classroom.id,
        });

        return { classroom, classroomToken };
    }

    // * Update Classroom
    @UseGuards(AuthGuard)
    @Put(':classroomId')
    async update(
        @Body() body: ClassroomUpdateDto,
        @Req() request: Request,
        @Param('classroomId') classroomId: string
    ) {
        const teacher = await this.authService.userId(request);

        const checkClassroom = await this.classroomService.findOne({ id: classroomId }, ['teachers']);

        if (!checkClassroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Check if the user id exist on teacher_classrooms table
        const isCreator = checkClassroom.teachers.some((existingTeacher: any) => existingTeacher.id === teacher);

        if (!isCreator) {
            throw new ForbiddenException('You do not have permission to assign teachers to this classroom');
        }

        if (checkClassroom.name === body.name) {
            throw new ConflictException('Classroom name already exists');
        }

        const classroom = await this.classroomService.update(classroomId, body);

        return { classroom };
    }

    // * Assign a teacher to a specific classroom
    @UseGuards(AuthGuard)
    @Post(':classroomId/teacher')
    async assignTeacherToClassroom(
        @Param('classroomId') classroomId: string,
        @Body('user_id') user_id: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const teacher = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['teachers']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Check if the user id exist on teacher_classrooms table
        const isCreator = classroom.teachers.some((existingTeacher: any) => existingTeacher.id === teacher);

        if (!isCreator) {
            throw new ForbiddenException('You do not have permission to assign teachers to this classroom');
        }

        const user = await this.userService.findOne({ id: user_id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // * Check if the teacher is already assigned to the classroom
        const userAlreadyInClassroom = classroom.teachers.some((existingUser: any) => existingUser.id === user_id);

        if (userAlreadyInClassroom) {
            throw new BadRequestException('Teacher is already assigned to this classroom');
        }

        classroom.teachers.push(user);

        return this.classroomService.create(classroom);
    }

    // * Assign a user to a specific classroom
    @UseGuards(AuthGuard)
    @Post(':classroomId/user')
    async assignUserToClassroom(
        @Param('classroomId') classroomId: string,
        @Body('user_id') user_id: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const teacher = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['students']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Check if the user id exist on teacher_classrooms table
        const classroom_teach = await this.classroomService.findOne({ id: classroomId }, ['teachers']);

        const isCreator = classroom_teach.teachers.some((existingTeacher: any) => existingTeacher.id === teacher);

        if (!isCreator) {
            throw new ForbiddenException('You do not have permission to assign teachers to this classroom');
        }

        const user = await this.userService.findOne({ id: user_id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // * Check if the user is already assigned to the classroom
        const userAlreadyInClassroom = classroom.students.some((existingUser: any) => existingUser.id === user_id);

        if (userAlreadyInClassroom) {
            throw new BadRequestException('User is already assigned to this classroom');
        }

        classroom.students.push(user);

        return this.classroomService.create(classroom);
    }

    // * Remove a teacher from a specific classroom
    @UseGuards(AuthGuard)
    @Delete(':classroomId/teacher/:userId')
    async removeTeacherFromClassroom(
        @Param('classroomId') classroomId: string,
        @Param('userId') userId: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId) || !isUUID(userId)) {
            throw new BadRequestException('Invalid UUID format');
        }

        const teacher = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['teachers']);

        // * Check teacher that wants to delete another teacher 
        const teacherIndex = classroom.teachers.findIndex(existingUser => existingUser.id === teacher);

        if (teacherIndex === -1) {
            throw new ForbiddenException('You do not have permission');
        }

        // * Check if teacher exist in the classroom
        const checkTeacher = classroom.teachers.findIndex(existingUser => existingUser.id === userId);

        if (checkTeacher === -1) {
            throw new NotFoundException('Teacher not found in classroom');
        }

        // * Stop the teacher from removing themselves
        if (userId === teacher) {
            throw new BadRequestException("You can't remove yourself");
        }

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Remove user
        classroom.teachers.splice(teacherIndex, 1);

        // * Update table
        await this.classroomService.create(classroom);

        return { message: 'User removed from classroom successfully' };
    }

    // * Remove a user from a specific classroom
    @UseGuards(AuthGuard)
    @Delete(':classroomId/user/:userId')
    async removeUserFromClassroom(
        @Param('classroomId') classroomId: string,
        @Param('userId') userId: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId) || !isUUID(userId)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const teacher = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['students']);

        if (!classroom) {
            throw new NotFoundException('Classroom not found');
        }

        // * Check Teacher 
        const checkTeacher = await this.classroomService.findOne({ id: classroomId }, ['teachers']);

        const teacherIndex = checkTeacher.teachers.findIndex(existingUser => existingUser.id === teacher);

        if (teacherIndex === -1) {
            throw new ForbiddenException('You do not have permission');
        }

        // * Check user 
        const userIndex = classroom.students.findIndex(existingUser => existingUser.id === userId);

        if (userIndex === -1) {
            throw new NotFoundException('User not found in this classroom');
        }

        // * Remove user
        classroom.students.splice(userIndex, 1);

        // * Update table
        await this.classroomService.create(classroom);

        return { message: 'User removed from classroom successfully' };
    }

    // * User leave classroom
    @UseGuards(AuthGuard)
    @Delete(':classroomId/exit')
    async userLeaveClassroom(
        @Param('classroomId') classroomId: string,
        @Req() request: Request
    ) {
        if (!isUUID(classroomId)) {
            throw new BadRequestException('Invalid UUID format');
        }
        
        const user = await this.authService.userId(request);

        const classroom = await this.classroomService.findOne({ id: classroomId }, ['students']);

        const checkUser = classroom.students.findIndex((student: any) => student.id === user);

        if (checkUser === -1) {
            throw new NotFoundException("Student not found");
        }

        classroom.students.splice(checkUser, 1);

        await this.classroomService.create(classroom);

        return { message: "Success" };
    }


    // * Get authenticated teacher clasroom
    @UseGuards(AuthGuard)
    @Get('teacher')
    async teacherClass(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        return this.userService.findOne({ id }, ['teachers']);
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
