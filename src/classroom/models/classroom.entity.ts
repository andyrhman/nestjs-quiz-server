import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassroomSession } from "src/classroom-session/models/classroom-session.models";
import { User } from "src/user/models/user.entity";
import { ClassroomToken } from "src/classroom-token/models/classroom-token.entity";

export enum ClassType {
    free = 'Free',
    paid = 'Paid',
}

@Entity('classrooms')
export class Classroom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: ClassType,
        default: ClassType.free,
        enumName: "class_type_status_enum"
    })
    class_type: ClassType;

    @Column({nullable: true})
    class_deadline: Date;

    @OneToMany(() => ClassroomSession, (classroom_session) => classroom_session.classroom)
    classroom_session: ClassroomSession[];

    @OneToMany(() => ClassroomToken, (class_token) => class_token.classroom)
    class_token: ClassroomToken[];

    @ManyToMany(() => User, (user) => user.classrooms, { cascade: true })
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