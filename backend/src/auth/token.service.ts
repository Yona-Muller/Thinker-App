import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TOKEN_EXPIRATION_TIME, LONG_TOKEN_EXPIRATION_TIME, TOKEN_REFRESH_TIME } from './constants';
import type { TokenObject, UserForToken } from './dto/token.dto';
import * as jwt from 'jsonwebtoken';

type tokenFields = 'x-token' | 'x-long-token';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createTokenByUser(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  setLongTokenOnResponse(token: string, response: Response) {
    response.cookie('x-long-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: LONG_TOKEN_EXPIRATION_TIME,
    });
  }

  setShortTokenOnResponse(token: string, response: Response) {
    response.cookie('x-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRATION_TIME,
    });
  }

  removeTokenFromResponse(response: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    const xTokenExists = 'x-token' in response.req.cookies;
    const xLongTokenExists = 'x-long-token' in response.req.cookies;

    if (xTokenExists) {
      response.clearCookie('x-token', cookieOptions);
    }

    if (xLongTokenExists) {
      response.clearCookie('x-long-token', cookieOptions);
    }
  }

  extractTokenFromCookies(request: Request, cookieName: tokenFields) {
    const token = request.cookies[cookieName] as string | undefined;
    if (!token) {
      throw new UnauthorizedException('There is no token');
    }
    return token;
  }

  async verifyToken(token: string) {
    try {
      const tokenObject = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })) as TokenObject;
      return tokenObject;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  isTokenExpiringSoon(tokenObject: TokenObject) {
    const expirationTime = tokenObject.exp * 1000;
    const currentTime = Date.now();
    return expirationTime - currentTime <= TOKEN_REFRESH_TIME;
  }

  async refreshToken(userForToken: UserForToken, response: Response) {
    const payload = {
      sub: userForToken.sub,
      role: userForToken.role,
    };
    const token = await this.jwtService.signAsync(payload);
    this.setShortTokenOnResponse(token, response);
  }

  async getUserIdFromToken(request: Request, cookieName: tokenFields = 'x-long-token') {
    const token = this.extractTokenFromCookies(request, cookieName);
    const tokenObject = await this.verifyToken(token);
    return tokenObject.sub;
  }
}
