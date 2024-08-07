// user.entity.ts
import { Exclude } from 'class-transformer';
import { Classroom } from 'src/classroom/models/classroom.entity';
import { Score } from 'src/quiz/models/score.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Token } from './token.entity';
import { Role } from 'src/role/models/role.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cart } from 'src/classroom/models/join-classroom.entity';
import { Order } from 'src/order/models/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  student_id: string; // Add a unique student ID column

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({ default: false })
  is_verified: boolean;

  @ManyToMany(() => Classroom, (classroom) => classroom.students)
  classrooms: Classroom[];

  @ManyToMany(() => Classroom, (classroom) => classroom.teachers)
  teachers: Classroom[];

  @OneToMany(() => Score, (scores) => scores.user)
  scores: Score[];

  @OneToMany(() => Token, (cart) => cart.user)
  verify: Token[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  usernameToLowerCase() {
    this.username = this.username.toLowerCase();
  }
}
