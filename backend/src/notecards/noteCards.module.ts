import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteCard } from './entities/notecard.entity';
import { NoteCardsService } from './noteCards.service';
import { NoteCardsController } from './noteCards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NoteCard])],
  controllers: [NoteCardsController],
  providers: [NoteCardsService],
  exports: [NoteCardsService],
})
export class NoteCardsModule {}
