import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  targetDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
