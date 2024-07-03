import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassroomSession } from "src/classroom-session/models/classroom-session.models";
import { User } from "src/user/models/user.entity";

@Entity('classrooms')
export class Classroom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => ClassroomSession, (classroom_session) => classroom_session.classroom)
    classroom_session: ClassroomSession[];

    @ManyToMany(() => User, (user) => user.classrooms)
    @JoinTable({
        name: "user_classrooms",
        joinColumn: {
            name: "classroom_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    users: User[];
}