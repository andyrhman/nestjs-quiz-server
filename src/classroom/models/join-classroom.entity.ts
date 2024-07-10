import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "./classroom.entity";
import { User } from "src/user/models/user.entity";

export enum ClassPaidStatus {
    paid = "Paid",
    unpaid = "Unpaid"
}

@Entity("classroom_status_paid")
export class JoinClassroomStatusPaid{
    @PrimaryGeneratedColumn('uuid')
    id: string;                         
    
    @Column({
        type: "enum",
        enum: ClassPaidStatus,
        default: ClassPaidStatus.unpaid
    })
    paid_status: string;

    @Column({name: "classroom_id"})
    classroom_id: string;

    @Column({name: "user_id"})
    user_id: string;

    @ManyToOne(() => Classroom, (classroom) => classroom.classroom_status_paid)
    @JoinColumn({name: "classroom_id"})
    classroom: Classroom;

    @ManyToOne(() => User, user => user.user_status_paid)
    @JoinColumn({name: "user_id"})
    user: User;
}