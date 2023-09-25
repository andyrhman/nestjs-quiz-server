import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { UserClassroomService } from './userclassroom.service';
import { UserClassroom } from './models/user-classroom.entity';

@Controller('classroom')
export class ClassroomController {
    constructor(
        private classroomService: ClassroomService
    ) { }

    @Get()
    async all() {
        return this.classroomService.fetchClass(['user', 'classroom']);
    }

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
    
        await this.classroomService.createUserClassroom(classrooms);
        
        return {
            message: "Created successfully"
        }
    }
}
