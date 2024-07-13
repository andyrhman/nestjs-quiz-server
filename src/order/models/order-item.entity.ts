import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Classroom } from "src/classroom/models/classroom.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_title: string;

    @Column()
    price: number;

    @Column({ name: "order_id" })
    order_id: string;

    @Column({ name: "classroom_id" })
    classroom_id: string;

    @ManyToOne(() => Order, order => order.order_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Classroom, classroom => classroom.order_item)
    @JoinColumn({ name: "classroom_id" })
    classroom: Classroom;
}