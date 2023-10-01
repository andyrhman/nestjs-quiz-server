// user.entity.ts
import { Exclude } from 'class-transformer';
import { Classroom } from 'src/classroom/models/classroom.entity';
import { UserClassroom } from 'src/classroom/models/user-classroom.entity';
import { Score } from 'src/quiz/models/score.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @OneToMany(() => UserClassroom, (classroom) => classroom.user)
  classroom: UserClassroom[]

  @OneToMany(() => Score, (scores) => scores.user)
  scores: Score[]
}