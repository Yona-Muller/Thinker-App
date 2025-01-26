import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NoteCard } from '../notecards/notecard.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => NoteCard, noteCard => noteCard.user)
  noteCards: NoteCard[];
}
