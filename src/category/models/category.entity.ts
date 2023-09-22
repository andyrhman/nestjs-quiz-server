import { Classroom } from 'src/classroom/models/classroom.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Classroom, (classroom) => classroom.category)
    classroom: Classroom[]
}