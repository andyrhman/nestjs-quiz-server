import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../category/models/category.entity";

@Entity()
export class Classroom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: "user_id"})
    user_id: string;

    @Column({name: "category_id"})
    category_id: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToOne(() => Category)
    @JoinColumn({name: "category_id"})
    category: Category;

}