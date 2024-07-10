import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { JoinClassroomStatusPaid } from './models/join-classroom.entity';

@Injectable()
export class JoinPaidClassroomService extends AbstractService {
    constructor(
        @InjectRepository(JoinClassroomStatusPaid) private readonly joinPaidClassroomRepository: Repository<JoinClassroomStatusPaid>
    ) {
        super(joinPaidClassroomRepository)
    }
}
