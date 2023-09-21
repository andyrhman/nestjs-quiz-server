import {
    Column,
    Generated,
    PrimaryGeneratedColumn,
    ManyToOne,
    Entity,
} from 'typeorm';
import { Score } from './score.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionUuid: string;

    @Column()
    question_no: string;

    @Column()
    question: string;

    @Column()
    opt1: string;

    @Column()
    opt2: string;

    @Column()
    opt3: string;

    @Column()
    opt4: string;

    @Column()
    correctAnswer: string;

    @Column({ default: false })
    answered: boolean;

    @ManyToOne(() => Score, score => score.questions)
    score: Score;
}
