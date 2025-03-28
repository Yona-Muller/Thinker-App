import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from '../utils/pagination/paginated.query.param.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dro';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User created successfully', type: ResponseUserDto })
  @ApiResponse({ status: 401, description: 'Incorrect user or password or businessId' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Users successfully retrieved', type: [ResponseUserDto] })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get User By Id' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User successfully retrieved', type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update User By Id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Add NoteCard to User' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiParam({ name: 'noteCardId', required: true, description: 'ID of the NoteCard' })
  @ApiResponse({ status: 200, description: 'NoteCard successfully added', type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User or NoteCard not found' })
  @Post(':id/noteCard/:noteCardId')
  async addNoteCardToUser(@Param('id') userId: string, @Param('noteCardId') noteCardId: string) {
    return this.userService.addNoteCardToUser(userId, noteCardId);
  }

  @ApiOperation({ summary: 'Remove NoteCard from User' })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiParam({ name: 'noteCardId', required: true, description: 'ID of the NoteCard' })
  @ApiResponse({ status: 200, description: 'NoteCard successfully removed', type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':userId/noteCard/:noteCardId')
  async removeNoteCardFromUser(@Param('userId') userId: string, @Param('noteCardId') noteCardId: string) {
    return this.userService.removeNoteCardFromUser(userId, noteCardId);
  }
}
