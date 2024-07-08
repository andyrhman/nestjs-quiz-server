// import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Classroom } from "./classroom.entity";

// @Entity()
// export class ClassroomTeacher {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({name: "user_teacher"})
//     user_teacher: string;
    
//     @ManyToOne(() => Classroom, (user_teacher) => user_teacher.classroom_teacher)
//     @JoinColumn({name: "user_teacher"})
//     teacher: Classroom;

// }