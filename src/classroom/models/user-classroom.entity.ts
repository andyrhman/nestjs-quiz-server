import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "./classroom.entity";

@Entity('user_clasrooms')
export class UserClassroom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "user_id"})
    user_id: string;

    @Column({name: "classroom_id"})
    classroom_id: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToOne(() => Classroom)
    @JoinColumn({name: "classroom_id"})
    classroom: Classroom;
}
