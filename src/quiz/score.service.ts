import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './models/score.entity';
import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class ScoreService extends AbstractService {
    constructor(
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
    ) {
        super(scoreRepository)
    }
    

    async findUserScore(options): Promise<any> {
        const scores = await this.scoreRepository.find({ where: options });
        return {
            total: scores.length,
            scores: scores
        };
    }
}
