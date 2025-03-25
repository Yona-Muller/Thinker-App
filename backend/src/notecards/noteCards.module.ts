import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NoteCardsController } from './noteCards.controller';
import { NoteCardsService } from './noteCards.service';
import { NoteCard } from './entities/notecard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteCard]),
    ConfigModule,
  ],
  controllers: [NoteCardsController],
  providers: [NoteCardsService],
  exports: [NoteCardsService],
})
export class NoteCardsModule {} 