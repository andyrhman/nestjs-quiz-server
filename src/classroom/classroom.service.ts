import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Classroom } from './models/classroom.entity';
import { Repository } from 'typeorm';
import { UserClassroom } from './models/user-classroom.entity';

@Injectable()
export class ClassroomService extends AbstractService {
    constructor(
        @InjectRepository(Classroom) private readonly classroomRepository: Repository<Classroom>
    ) {
        super(classroomRepository)
    }
}
