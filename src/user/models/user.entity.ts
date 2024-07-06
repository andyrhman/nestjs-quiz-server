// user.entity.ts
import { Exclude } from 'class-transformer';
import { Classroom } from 'src/classroom/models/classroom.entity';
import { Score } from 'src/quiz/models/score.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Token } from './token.entity';
import { Role } from 'src/role/models/role.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

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

  @ManyToMany(() => Classroom, (classroom) => classroom.users)
  classrooms: Classroom[];

  @OneToMany(() => Score, (scores) => scores.user)
  scores: Score[];

  @OneToMany(() => Token, (cart) => cart.user)
  verify: Token[];

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role: Role;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

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

  @BeforeInsert()
  async generateStudentId() {
    const year = new Date().getFullYear().toString().slice(-2); // Get last two digits of the current year

    const userCount = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where(`user.created_at LIKE :year`, { year: `${new Date().getFullYear()}%` })
      .getCount(); // Get the count of users registered in the current year

    const increment = (userCount + 1).toString().padStart(6, '0'); // Increment and pad with leading zeros
    this.student_id = `${year}${increment}`; // Generate student ID
    console.log(`Generated student_id: ${this.student_id}`);

  }
}
