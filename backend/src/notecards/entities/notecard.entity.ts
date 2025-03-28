import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NoteCardType {
  YOUTUBE = 'youtube',
  ARTICLE = 'article',
  PODCAST = 'podcast',
  BOOK = 'book',
}

@Entity('note_card')
export class NoteCard {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  sourceUrl: string;

  @Column({
    type: 'enum',
    enum: NoteCardType,
    default: 'youtube',
  })
  sourceType: NoteCardType;

  @Column('varchar', { array: true, nullable: true })
  keyTakeaways: string[];

  @Column('varchar', { array: true, nullable: true })
  thoughts: string[];

  @Column('varchar', { array: true, nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  channelName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  channelAvatar: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
