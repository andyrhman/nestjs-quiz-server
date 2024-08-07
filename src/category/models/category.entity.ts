import { Classroom } from 'src/classroom/models/classroom.entity';
import { Score } from 'src/quiz/models/score.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Score, (score) => score.category)
    score: Score[];
}