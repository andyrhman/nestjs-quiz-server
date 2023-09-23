import {
    Column,
    Generated,
    PrimaryGeneratedColumn,
    ManyToOne,
    Entity,
    JoinColumn,
} from 'typeorm';
import { Score } from './score.entity';
import { Category } from 'src/category/models/category.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "category_id"})
    category_id: string;

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

    @ManyToOne(() => Category)
    @JoinColumn({name: "category_id"})
    category: Category
}
