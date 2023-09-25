import { Request } from 'express';
import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { UserClassroomService } from './userclassroom.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('classroom')
export class ClassroomController {
    constructor(
        private classroomService: ClassroomService,
        private userClassroomService: UserClassroomService,
        private authService: AuthService,
        private userService: UserService
    ) { }

    // * Get all classrooms and the users
    @Get()
    async all() {
        return this.userClassroomService.all(['user', 'classroom']);
    }

    // * Create classroom and assign the users
    @Post()
    async create(
        @Body() body: any
    ) {
        const checkClassroom = await this.classroomService.findOne({name: body.name});

        if (checkClassroom) {
            throw new BadRequestException(`Classroom with the name '${body.name}' already exists`)
        };

        const classroom = await this.classroomService.create({
            name: body.name,
            category_id: body.category_id
        })

        let class_id = classroom.id;

        let classrooms = [];

        for (let i = 0; i < body.classrooms.length; i++) {
            let classr = {
                ...body.classrooms[i],
                classroom_id: class_id
            };
            classrooms.push(classr);
        }

        await this.userClassroomService.createUserClassroom(classrooms);

        return {
            message: "Created successfully"
        }
    }

    // * Assign user to a classroom
    @Post(':id')
    async assign(
        @Param('id') id: number,
        @Body() body: any
    ) {
        // * Initialize an empty array to hold the UserClassroom entities
        let classrooms = [];

        // * Loop through each user in the classrooms array from the request body

        for (let i = 0; i < body.classrooms.length; i++) {

            // * find an existing UserClassroom entity with the provided user_id

            const user = await this.userClassroomService.findOne({ user_id: body.classrooms[i].user_id, classroom_id: id }, ['user']);

            // ? If a UserClassroom entity is found and the user_id matches the provided user_id, throw an exception
            
            if (user && user.user_id === body.classrooms[i].user_id) {
                throw new BadRequestException(`User with the name "${user.user.fullname}" already exists in the classroom`)
            }

            
            // ? Create a new UserClassroom object with the user data and the classroom_id
            let classr = {
                ...body.classrooms[i],
                classroom_id: id
            };

            // * Add the new UserClassroom object to the classrooms array
            
            classrooms.push(classr);
        }

        await this.userClassroomService.createUserClassroom(classrooms);

        return {
            message: "Successfully asigned"
        }
    }

    // * Get authenticated user clasroom
    @UseGuards(AuthGuard)
    @Get('user')
    async userClass(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        return this.userService.findOne({ id }, ['classroom']);
    }
}
