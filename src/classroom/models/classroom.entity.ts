import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassroomSession } from "src/classroom-session/models/classroom-session.models";
import { User } from "src/user/models/user.entity";
import { ClassroomToken } from "src/classroom-token/models/classroom-token.entity";
import { Cart } from "./join-classroom.entity";
import { OrderItem } from "src/order/models/order-item.entity";

export enum ClassType {
    free = 'Free',
    paid = 'Paid',
}

export enum ClassStatus {
    active = 'Active',
    closed = 'Closed',
}

export enum ClassLevel {
    beginner = 'Beginner',
    medium = 'Medium',
    hard = 'Hard',
    advance = 'Advance',
}

export enum ClassVisibility {
    public = 'Public',
    private = 'Private',
}

@Entity('classrooms')
export class Classroom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    small_description: string;

    @Column()
    study_estimation: string;

    @Column({ type: 'text' })
    long_description: string;

    @Column({
        type: 'enum',
        enum: ClassLevel,
        default: ClassLevel.beginner
    })
    class_level: ClassLevel;

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

    @Column({
        type: 'enum',
        enum: ClassVisibility,
        default: ClassVisibility.private
    })
    class_visibility: ClassVisibility;

    // ! Wait after frontend is ready then use this
    @Column({nullable: true})
    class_deadline: Date;

    @Column()
    picture: string;

    @Column()
    price: number;

    @OneToMany(() => ClassroomSession, (classroom_session) => classroom_session.classroom)
    classroom_session: ClassroomSession[];

    @OneToMany(() => ClassroomToken, (class_token) => class_token.classroom)
    class_token: ClassroomToken[];

    @OneToMany(() => Cart, (cart) => cart.classroom)
    cart: Cart[];

    @OneToMany(() => OrderItem, order_item => order_item.classroom)
    order_item: OrderItem[];

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
    students: User[];

    @ManyToMany(() => User, (user) => user.teachers, { onDelete: 'CASCADE' })
    @JoinTable({
        name: "teacher_classrooms",
        joinColumn: {
            name: "classroom_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "teacher_id",
            referencedColumnName: "id",
        },
    })
    teachers: User[];
}