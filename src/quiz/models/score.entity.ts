import {
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Question } from './quiz.entity';
import { User } from 'src/user/models/user.entity';
import { Category } from 'src/category/models/category.entity';

@Entity('scores')
export class Score{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "user_id"}) // Make this field optional
    user_id: string;

    @Column({name: "category_id"})
    category_id: string;

    @Column('double precision', { default: 0 })
    score: number;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => Category, category => category.score, { eager: true })
    @JoinColumn({name: "category_id"})
    category: Category;    

    @ManyToOne(() => User, (user) => user.scores)
    @JoinColumn({name: "user_id"})
    user: User;
}
