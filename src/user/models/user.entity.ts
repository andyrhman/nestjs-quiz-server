// user.entity.ts
import { Exclude } from 'class-transformer';
import { Classroom } from 'src/classroom/models/classroom.entity';
import { Score } from 'src/quiz/models/score.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

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

  @ManyToMany(() => Classroom, (classroom) => classroom.users)
  classrooms: Classroom[];  

  @OneToMany(() => Score, (scores) => scores.user)
  scores: Score[]
}