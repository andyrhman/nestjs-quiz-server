import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { Category } from 'src/category/models/category.entity';

@Entity('time_limits')
export class TimeLimit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    time_limit: number;

    @Column({name: "category_id"})
    category_id: string;

    @OneToOne(() => Category)
    @JoinColumn({name: "category_id"})
    category: Category
}
