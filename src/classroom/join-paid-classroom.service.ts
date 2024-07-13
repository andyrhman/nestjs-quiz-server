import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Cart } from './models/join-classroom.entity';

@Injectable()
export class JoinPaidClassroomService extends AbstractService {
    constructor(
        @InjectRepository(Cart) private readonly joinPaidClassroomRepository: Repository<Cart>
    ) {
        super(joinPaidClassroomRepository)
    }
}
