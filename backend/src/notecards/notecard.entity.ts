import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class NoteCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sourceUrl: string;

  @Column({
    type: 'enum',
    enum: ['youtube', 'article', 'podcast', 'book'],
    default: 'youtube'
  })
  sourceType: 'youtube' | 'article' | 'podcast' | 'book';

  @Column("text", { array: true })
  keyTakeaways: string[];

  @Column("text", { array: true })
  thoughts: string[];

  @Column("text", { array: true })
  tags: string[];

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  channelName: string;

  @Column({ nullable: true })
  channelAvatar: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.noteCards)
  @JoinColumn({ name: 'userId' })
  user: User;
} 