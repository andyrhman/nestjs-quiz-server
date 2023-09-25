import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { UserClassroom } from './models/user-classroom.entity';

@Injectable()
export class UserClassroomService extends AbstractService{
    constructor(
        @InjectRepository(UserClassroom) private readonly userClassroomRepository: Repository<UserClassroom>,
    ) {
        super(userClassroomRepository)
    }
}
