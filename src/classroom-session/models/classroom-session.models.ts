import { Classroom } from "src/classroom/models/classroom.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("classroom_session")
export class ClassroomSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    session_date: string;

    @Column({name: "class_id"})
    class_id: string;

    @ManyToOne(() => Classroom)
    @JoinColumn({name: "class_id"})
    classroom: Classroom;
}