import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string },
  ) {
    return await this.usersService.register(body.email, body.name, body.password);
  }
}
