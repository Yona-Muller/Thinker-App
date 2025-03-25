// import { Controller, Get, Post, Body, UseGuards, Request, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { NoteCardsService } from './notecards.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { NoteCard } from './entities/notecard.entity';

// @Controller('notecards')
// @UseGuards(JwtAuthGuard)
// export class NoteCardsController {
//   private readonly logger = new Logger(NoteCardsController.name);

//   constructor(private readonly noteCardsService: NoteCardsService) {}

//   @Post()
//   async create(@Request() req, @Body() createNoteCardDto: any): Promise<NoteCard> {
//     this.logger.log('Received POST /notecards request');
//     this.logger.log(`Request body: ${JSON.stringify(createNoteCardDto)}`);
//     this.logger.log(`User: ${JSON.stringify(req.user)}`);
    
//     try {
//       // וידוא שיש את כל השדות הנדרשים
//       if (!createNoteCardDto.sourceUrl) {
//         throw new BadRequestException('sourceUrl is required');
//       }

//       // קבלת מזהה המשתמש מהטוקן
//       const userId = req.user.id || req.user.sub || req.user.userId;
//       if (!userId) {
//         throw new UnauthorizedException('User ID not found in token');
//       }

//       // יצירת אובייקט עם כל השדות הנדרשים
//       const noteCardData = {
//         ...createNoteCardDto,
//         userId,
//         title: createNoteCardDto.title || 'כותרת זמנית',
//         thumbnailUrl: createNoteCardDto.thumbnailUrl || 'https://example.com/default-thumbnail.jpg',
//         channelName: createNoteCardDto.channelName || 'ערוץ לא ידוע',
//         channelAvatar: createNoteCardDto.channelAvatar || 'https://example.com/default-avatar.jpg',
//         keyTakeaways: createNoteCardDto.keyTakeaways || [],
//         thoughts: createNoteCardDto.thoughts || [],
//         sourceType: createNoteCardDto.sourceType || 'youtube'
//       };

//       this.logger.log(`Creating notecard with data: ${JSON.stringify(noteCardData)}`);
      
//       // יצירת הכרטיס - קריאה אחת בלבד ל-create
//       const notecard = await this.noteCardsService.create(noteCardData);
      
//       this.logger.log(`Created notecard with ID: ${notecard.id}`);
//       return notecard;
//     } catch (error) {
//       this.logger.error('Error in create:', error);
//       throw error;
//     }
//   }

//   @Get()
//   async findAll(@Request() req) {
//     const userId = req.user.id || req.user.sub || req.user.userId;
//     if (!userId) {
//       throw new UnauthorizedException('User ID not found in token');
//     }

//     this.logger.log(`Getting notecards for user: ${userId}`);
//     return this.noteCardsService.findAllByUser(userId);
//   }
// }

import { Controller, Get, Param, Post, Body, ValidationPipe, Delete, Query, Patch, Res } from '@nestjs/common';
import { NoteCardsService } from './noteCards.service';
import { CreateNoteCardDto } from './dto/create-noteCard.dto';
import { UpdateNoteCardDto } from './dto/update-noteCard.dto';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IsPublic } from 'src/utils/decorators/isPublic.decorator';
import { ResponseNoteCardDto } from './dto/response-noteCard.dro';

@ApiTags('customer')
@Controller('customer')
export class CustomersController {
  constructor(private readonly noteCardsService: NoteCardsService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers', type: [ResponseCustomerDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCustomers(@Query() paginationDto: PaginationDto) {
    return this.noteCardsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single customer by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the customer' })
  @ApiResponse({ status: 200, description: 'Customer found', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getOne(@Param('id') id: string) {
    return this.noteCardsService.findOne(id);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get all customers for this business ID' })
  @ApiParam({ name: 'businessId', description: 'The business ID' })
  @ApiResponse({ status: 200, description: 'Customers found', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'No customers found for this business' })
  async findAllCustomersByBusinessId(@Param('businessId') businessId: string) {
    return this.noteCardsService.findAllNoteCardsByBusinessId(businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateNoteCardDto })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: ResponseNoteCardDto })
  @ApiResponse({ status: 400, description: 'Invalid customer data' })
  async create(@Body(ValidationPipe) createCustomer: CreateNoteCardDto) {
    return this.noteCardsService.create(createCustomer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to update' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: ResponseNoteCardDto })
  @ApiResponse({ status: 404, description: 'Failed to update customer with id 07ea-f6ff-40bb-994b-71b8: error message' })
  @ApiBody({ type: UpdateNoteCardDto })
  async update(@Param('id') id: string, @Body() updateCustomer: UpdateNoteCardDto) {
    return this.noteCardsService.update(id, updateCustomer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to delete' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.noteCardsService.delete(id);
      return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
      return { success: false, message: `Failed to delete customer: ${error.message}` };
    }
  }
}
