import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dro';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BusinessesService } from 'src/businesses/businesses.service';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private businessService: BusinessesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const existingBusiness = await this.businessService.findOne(createUserDto.businessId);

    if (!existingBusiness) {
      throw new BadRequestException('Invalid businessId');
    }

    const userFromDB = await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, createUserDto);
      user.businesses = [existingBusiness];
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
      relations: ['businesses'],
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
      relations: ['businesses'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new ResponseUserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['businesses'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }

    Object.assign(updatedUser, updateUserDto);

    const savedUser = await this.userRepository.save(updatedUser);

    return new ResponseUserDto(savedUser);
  }

  async addBusinessToUser(userId: string, businessId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['businesses'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const business = await this.businessService.findOne(businessId);
    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }
    const isBusinessAlreadyAdded = user.businesses.some((b) => b.id === businessId);

    if (isBusinessAlreadyAdded) {
      throw new ConflictException(`Business with ID ${businessId} already associated with this user`);
    }
    user.businesses = [...user.businesses, business];

    return new ResponseUserDto(await this.userRepository.save(user));
  }

  async removeBusinessFromUser(userId: string, businessId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['businesses'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.businesses = user.businesses.filter((b) => b.id !== businessId);
    return new ResponseUserDto(await this.userRepository.save(user));
  }

  async findOneByField({ email, username, id }: SearchUserDto) {
    const whereConditions = {} as Partial<SearchUserDto>;
    if (id) whereConditions.id = id;
    if (username) whereConditions.username = username;
    if (email) whereConditions.email = email;

    return await this.userRepository.findOne({
      where: whereConditions,
      relations: ['businesses'],
    });
  }
}
