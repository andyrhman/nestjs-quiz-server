import {
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Entity,
} from 'typeorm';
import { Question } from './quiz.entity';

@Entity('scores')
export class Score{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    questionUuid: string;

    @Column({ default: 0 })
    score: number;

    @Column({ default: false })
    completed: boolean;

    @OneToMany(() => Question, question => question.score)
    questions: Question[];
}
