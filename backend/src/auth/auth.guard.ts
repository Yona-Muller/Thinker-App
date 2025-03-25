import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      this.tokenService.extractTokenFromCookies(request, 'x-long-token');
    } catch (error) {
      const token = this.tokenService.extractTokenFromCookies(request, 'x-token');
      const tokenObject = await this.tokenService.verifyToken(token);
      request['tokenObject'] = tokenObject;
      if (this.tokenService.isTokenExpiringSoon(tokenObject)) {
        this.tokenService.refreshToken(tokenObject, response);
      }
    }

    return true;
  }
}
