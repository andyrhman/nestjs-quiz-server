import {
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Entity,
} from 'typeorm';
import { Question } from './quiz.entity';

@Entity('scores')
export class Score{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    score: number;

    @OneToMany(() => Question, question => question.score)
    questions: Question[];
}
