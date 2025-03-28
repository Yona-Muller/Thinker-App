import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dro';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NoteCardsService } from 'src/notecards/noteCards.service';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private noteCardsService: NoteCardsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const userFromDB = await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, createUserDto);
      return await manager.save(user);
    });

    return new ResponseUserDto(userFromDB);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      relations: ['noteCards'],
    });

    return {
      data: users.map((user) => new ResponseUserDto(user)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['noteCards'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new ResponseUserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['noteCards'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }

    Object.assign(updatedUser, updateUserDto);

    const savedUser = await this.userRepository.save(updatedUser);

    return new ResponseUserDto(savedUser);
  }

  async addNoteCardToUser(userId: string, noteCardId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['noteCards'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const noteCard = await this.noteCardsService.findOne(noteCardId);
    if (!noteCard) {
      throw new NotFoundException(`NoteCard with ID ${noteCardId} not found`);
    }

    const isNoteCardAlreadyAdded = user.noteCards.some((nc) => nc.id === noteCardId);

    if (isNoteCardAlreadyAdded) {
      throw new ConflictException(`NoteCard with ID ${noteCardId} already associated with this user`);
    }

    user.noteCards = [...user.noteCards, noteCard];

    return new ResponseUserDto(await this.userRepository.save(user));
  }

  async removeNoteCardFromUser(userId: string, noteCardId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['noteCards'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.noteCards = user.noteCards.filter((nc) => nc.id !== noteCardId);

    return new ResponseUserDto(await this.userRepository.save(user));
  }

  async findOneByField({ email, username, id }: SearchUserDto) {
    const whereConditions = {} as Partial<SearchUserDto>;
    if (id) whereConditions.id = id;
    if (username) whereConditions.username = username;
    if (email) whereConditions.email = email;

    return await this.userRepository.findOne({
      where: whereConditions,
      relations: ['noteCards'],
    });
  }
}
