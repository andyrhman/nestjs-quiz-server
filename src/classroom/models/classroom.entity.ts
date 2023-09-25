import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../category/models/category.entity";

@Entity('classrooms')
export class Classroom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: "category_id"})
    category_id: string;

    @ManyToOne(() => Category)
    @JoinColumn({name: "category_id"})
    category: Category;

}