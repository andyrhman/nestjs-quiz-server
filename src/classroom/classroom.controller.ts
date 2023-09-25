import { Request } from 'express';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
    ){
        let classrooms = [];

        for (let i = 0; i < body.classrooms.length; i++) {
            let classr = {
                ...body.classrooms[i],
                classroom_id: id
            };
            classrooms.push(classr);
        }
    
        await this.userClassroomService.createUserClassroom(classrooms);

        return{
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
