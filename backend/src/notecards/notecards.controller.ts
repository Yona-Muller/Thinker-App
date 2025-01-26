import { Controller, Get, Post, Body, UseGuards, Request, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { NoteCardsService } from './notecards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NoteCard } from './notecard.entity';

@Controller('notecards')
@UseGuards(JwtAuthGuard)
export class NoteCardsController {
  private readonly logger = new Logger(NoteCardsController.name);

  constructor(private readonly noteCardsService: NoteCardsService) {}

  @Post()
  async create(@Request() req, @Body() createNoteCardDto: any): Promise<NoteCard> {
    this.logger.log('Received POST /notecards request');
    this.logger.log(`Request body: ${JSON.stringify(createNoteCardDto)}`);
    this.logger.log(`User: ${JSON.stringify(req.user)}`);
    
    try {
      // וידוא שיש את כל השדות הנדרשים
      if (!createNoteCardDto.sourceUrl) {
        throw new BadRequestException('sourceUrl is required');
      }

      const userId = req.user.sub || req.user.userId;
      if (!userId) {
        throw new UnauthorizedException('User ID not found in token');
      }

      // יצירת אובייקט עם כל השדות הנדרשים
      const noteCardData = {
        ...createNoteCardDto,
        userId,
        title: createNoteCardDto.title || 'כותרת זמנית',
        thumbnailUrl: createNoteCardDto.thumbnailUrl || 'https://example.com/default-thumbnail.jpg',
        channelName: createNoteCardDto.channelName || 'ערוץ לא ידוע',
        channelAvatar: createNoteCardDto.channelAvatar || 'https://example.com/default-avatar.jpg',
        keyTakeaways: createNoteCardDto.keyTakeaways || [],
        thoughts: createNoteCardDto.thoughts || [],
        sourceType: createNoteCardDto.sourceType || 'youtube'
      };

      this.logger.log(`Creating notecard with data: ${JSON.stringify(noteCardData)}`);
      const notecard = await this.noteCardsService.create(noteCardData);
      
      this.logger.log(`Created notecard with ID: ${notecard.id}`);
      return notecard;
    } catch (error) {
      this.logger.error('Error in create:', error);
      throw error;
    }
  }

  @Get()
  async findAll(@Request() req): Promise<NoteCard[]> {
    this.logger.log('Received GET /notecards request');
    
    try {
      const userId = req.user.sub || req.user.userId;
      this.logger.log(`Finding notecards for user ${userId}`);
      
      const notecards = await this.noteCardsService.findAllByUser(userId);
      this.logger.log(`Found ${notecards.length} notecards`);
      
      return notecards;
    } catch (error) {
      this.logger.error('Error in findAll:', error);
      throw error;
    }
  }
}