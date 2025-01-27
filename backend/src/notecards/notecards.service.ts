import { Injectable, HttpException, HttpStatus, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteCard } from './notecard.entity';
import { YouTubeService } from '../youtube/youtube.service';

@Injectable()
export class NoteCardsService {
  private readonly logger = new Logger(NoteCardsService.name);

  constructor(
    @InjectRepository(NoteCard)
    private noteCardsRepository: Repository<NoteCard>,
  ) {}

  async create(createNoteCardDto: any): Promise<NoteCard> {
    try {
      this.logger.log('Creating new notecard');
      this.logger.log(`Data: ${JSON.stringify(createNoteCardDto)}`);
      
      const notecard = this.noteCardsRepository.create(createNoteCardDto);
      const result = await this.noteCardsRepository.save(notecard);
      
      // טיפול במקרה שמקבלים מערך
      const savedNotecard: NoteCard = Array.isArray(result) ? result[0] : result;
      
      this.logger.log(`Saved notecard: ${JSON.stringify(savedNotecard)}`);
      
      if (!savedNotecard || !savedNotecard.id) {
        throw new InternalServerErrorException('Failed to create notecard');
      }

      return savedNotecard;
    } catch (error) {
      this.logger.error('Error creating notecard:', error);
      throw new InternalServerErrorException('Failed to create notecard: ' + error.message);
    }
  }

  async findAllByUser(userId: number): Promise<NoteCard[]> {
    try {
      this.logger.log(`Finding notecards for user ${userId}`);
      const notecards = await this.noteCardsRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
      this.logger.log(`Found ${notecards.length} notecards`);
      return notecards;
    } catch (error) {
      this.logger.error('Error finding notecards:', error);
      throw new InternalServerErrorException('Failed to fetch notecards: ' + error.message);
    }
  }

  async findOne(id: number): Promise<NoteCard> {
    return await this.noteCardsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}  