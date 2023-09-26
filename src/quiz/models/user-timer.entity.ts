import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { Score } from './score.entity';

@Entity('user_question_timers')
export class UserQuestionTimer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "score_id"})
    score_id: string;

    @Column({ type: 'bigint' }) // Store timestamp as bigint.
    startedAt: number; // Store the start timestamp in milliseconds

    @OneToOne(() => Score)
    @JoinColumn({name: "score_id"})
    score: Score;
}
