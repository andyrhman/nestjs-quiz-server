import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./quiz.entity";

@Entity('user_questions')
export class UserQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "user_id"})
    user_id: string;

    @Column({name: "question_id"})
    question_id: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToOne(() => Question)
    @JoinColumn({name: "question_id"})
    question: Question;

    @Column({ default: false })
    answered: boolean;
}
