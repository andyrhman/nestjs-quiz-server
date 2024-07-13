import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "./classroom.entity";
import { User } from "src/user/models/user.entity";
import { OrderItem } from "src/order/models/order-item.entity";
import { Order } from "src/order/models/order.entity";

export enum ClassPaidStatus {
    paid = "Paid",
    unpaid = "Unpaid"
}

@Entity("cart")
export class Cart{
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

    @Column({name: "order_id", nullable: true})
    order_id: string;

    @Column({name: "user_id"})
    user_id: string;

    @ManyToOne(() => Order, (order) => order.cart, { onDelete: 'CASCADE' })
    @JoinColumn({name: "order_id"})
    order: Order;

    @ManyToOne(() => Classroom, (classroom) => classroom.cart, { onDelete: 'CASCADE' })
    @JoinColumn({name: "classroom_id"})
    classroom: Classroom;

    @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn({name: "user_id"})
    user: User;
}