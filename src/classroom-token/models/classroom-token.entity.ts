import { Classroom } from "src/classroom/models/classroom.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('classroom_token')
export class ClassroomToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    key: string;

    @Column({name: "classroom_id"})
    classroom_id: string;

    @ManyToOne(() => Classroom, (classroom) => classroom.class_token)
    @JoinColumn({name: "classroom_id"})
    classroom: Classroom;
}