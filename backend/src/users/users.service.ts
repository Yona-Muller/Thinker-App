import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(email: string, name: string, password: string): Promise<User> {
    // בדוק אם המייל כבר קיים
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email is already in use.');
    }

    // הצפן את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // צור את המשתמש החדש
    const newUser = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    // שמור את המשתמש בבסיס הנתונים
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
