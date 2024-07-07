import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Classroom } from './models/classroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomService extends AbstractService {
    constructor(
        @InjectRepository(Classroom) private readonly classroomRepository: Repository<Classroom>
    ) {
        super(classroomRepository)
    }

    public generateToken(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters[randomIndex];
        }
        return token;
    }
}
