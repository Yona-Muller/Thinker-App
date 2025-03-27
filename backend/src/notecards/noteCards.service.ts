import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteCard } from './entities/notecard.entity';
import { CreateNoteCardDto } from './dto/create-notecerd.dto';
import { UpdateNoteCardDto } from './dto/update-notecerd.dto';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';

@Injectable()
export class NoteCardsService {
  private readonly logger = new Logger(NoteCardsService.name);

  constructor(
    @InjectRepository(NoteCard)
    private readonly noteCardsRepository: Repository<NoteCard>
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { page = 1, limit = 100 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await this.noteCardsRepository.findAndCount({
        skip,
        take: limit,
      });
      return { data, total, page, limit };
    } catch (error) {
      this.logger.error(`Error in findAll: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<NoteCard> {
    const noteCard = await this.noteCardsRepository.findOne({ where: { id } });
    if (!noteCard) {
      throw new NotFoundException('NoteCard not found');
    }
    return noteCard;
  }

  async findAllNoteCardsByUserId(userId: string): Promise<NoteCard[]> {
    const noteCards = await this.noteCardsRepository.find({
      where: { userId: userId },
    });
    return noteCards;
  }

  async create(createNoteCardDto: CreateNoteCardDto): Promise<NoteCard> {
    try {
      const newNoteCard = this.noteCardsRepository.create(createNoteCardDto);
      return await this.noteCardsRepository.save(newNoteCard);
    } catch (error) {
      this.logger.error(`Failed to create NoteCard: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateNoteCardDto: UpdateNoteCardDto): Promise<NoteCard> {
    try {
      const noteCard = await this.findOne(id);
      const updatedNoteCard = this.noteCardsRepository.merge(noteCard, updateNoteCardDto);
      return await this.noteCardsRepository.save(updatedNoteCard);
    } catch (error) {
      this.logger.error(`Failed to update NoteCard with id ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const noteCard = await this.findOne(id);
      await this.noteCardsRepository.remove(noteCard);
      return { success: true, message: 'NoteCard deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete NoteCard with id ${id}: ${error.message}`);
      throw error;
    }
  }
}
