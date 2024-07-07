import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassroomSession } from "src/classroom-session/models/classroom-session.models";
import { User } from "src/user/models/user.entity";
import { ClassroomToken } from "src/classroom-token/models/classroom-token.entity";

export enum ClassType {
    free = 'Free',
    paid = 'Paid',
}

export enum ClassStatus {
    active = 'Active',
    closed = 'Closed',
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
        default: ClassType.free
    })
    class_type: ClassType;
 
    @Column({
        type: 'enum',
        enum: ClassStatus,
        default: ClassStatus.active
    })
    class_status: ClassStatus;

    @Column({nullable: true})
    class_deadline: Date;

    @Column({name: "user_teacher"})
    user_teacher: string;

    @OneToMany(() => ClassroomSession, (classroom_session) => classroom_session.classroom)
    classroom_session: ClassroomSession[];

    @OneToMany(() => ClassroomToken, (class_token) => class_token.classroom)
    class_token: ClassroomToken[];

    @ManyToOne(() => User, (user_teacher) => user_teacher.teacher)
    @JoinColumn({name: "user_teacher"})
    teacher: User;

    @ManyToMany(() => User, (user) => user.classrooms, { onDelete: 'CASCADE' })
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