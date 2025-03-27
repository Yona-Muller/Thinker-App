import { Controller, Get, Param, Post, Body, ValidationPipe, Delete, Query, Patch } from '@nestjs/common';
import { NoteCardsService } from './noteCards.service';
import { CreateNoteCardDto } from './dto/create-notecerd.dto';
import { UpdateNoteCardDto } from './dto/update-notecerd.dto';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ResponseNoteCardDto } from './dto/response-notecard.dro';

@ApiTags('note-card')
@Controller('note-card')
export class NoteCardsController {
  constructor(private readonly noteCardsService: NoteCardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all note cards' })
  @ApiResponse({ status: 200, description: 'List of note cards', type: [ResponseNoteCardDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNoteCards(@Query() paginationDto: PaginationDto) {
    return this.noteCardsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note card by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the note card' })
  @ApiResponse({ status: 200, description: 'Note card found', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'Note card not found' })
  async getOne(@Param('id') id: string) {
    return this.noteCardsService.findOne(id);
  }

  @Get('noteCards/:userId')
  @ApiOperation({ summary: 'Get all note cards for this user ID' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Note cards found', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'Note cards not found' })
  async findAllNoteCardsByUserId(@Param('id') userId: string) {
    return this.noteCardsService.findAllNoteCardsByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note card' })
  @ApiBody({ type: CreateNoteCardDto })
  @ApiResponse({ status: 201, description: 'Note card created successfully', type: ResponseNoteCardDto })
  @ApiResponse({ status: 400, description: 'Invalid note card data' })
  async create(@Body(ValidationPipe) createNoteCard: CreateNoteCardDto) {
    return this.noteCardsService.create(createNoteCard);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing note card' })
  @ApiParam({ name: 'id', description: 'The ID of the note card to update' })
  @ApiResponse({ status: 200, description: 'Note card updated successfully', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'Note card not found' })
  @ApiBody({ type: UpdateNoteCardDto })
  async update(@Param('id') id: string, @Body() updateNoteCard: UpdateNoteCardDto) {
    return this.noteCardsService.update(id, updateNoteCard);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note card by ID' })
  @ApiResponse({ status: 200, description: 'Note card deleted successfully' })
  @ApiParam({ name: 'id', description: 'The ID of the note card to delete' })
  @ApiResponse({ status: 404, description: 'Note card not found' })
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.noteCardsService.delete(id);
      return { success: true, message: 'Note card deleted successfully' };
    } catch (error) {
      return { success: false, message: `Failed to delete note card: ${error.message}` };
    }
  }
}
