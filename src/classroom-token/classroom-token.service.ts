import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { ClassroomToken } from './models/classroom-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomTokenService extends AbstractService {
    constructor(
        @InjectRepository(ClassroomToken) private readonly classroomTokenRepository: Repository<ClassroomToken>
    ) {
        super(classroomTokenRepository);
    }
}
