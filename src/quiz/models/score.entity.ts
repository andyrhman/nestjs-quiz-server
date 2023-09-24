import {
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Entity,
    JoinColumn,
    ManyToMany,
} from 'typeorm';
import { Question } from './quiz.entity';
import { User } from 'src/user/models/user.entity';
import { Category } from 'src/category/models/category.entity';

@Entity('scores')
export class Score{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "user_id", nullable: true}) // Make this field optional
    user_id: string;

    @Column({name: "category_id"})
    category_id: string;

    @Column('double precision', { default: 0 })
    score: number;

    @Column({ default: false })
    completed: boolean;

    @OneToMany(() => Category, category => category.score)
    @JoinColumn({name: "category_id"})
    category: Category[];

    @ManyToMany(() => User)
    @JoinColumn({name: "user_id"})
    user: User
}
