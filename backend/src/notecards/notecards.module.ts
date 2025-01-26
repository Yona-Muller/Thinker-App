import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NoteCardsController } from './notecards.controller';
import { NoteCardsService } from './notecards.service';
import { NoteCard } from './notecard.entity';
import { YouTubeService } from '../youtube/youtube.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteCard]),
    ConfigModule,
  ],
  controllers: [NoteCardsController],
  providers: [NoteCardsService, YouTubeService],
  exports: [NoteCardsService],
})
export class NoteCardsModule {} 