import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    try {
      console.log('Login attempt for:', loginData.email); // לוג לדיבוג
      const result = await this.authService.login(loginData.email, loginData.password);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}