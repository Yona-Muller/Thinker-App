import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // צריך להיות זהה למפתח ב-AuthModule
    });
  }

  async validate(payload: any) {
    this.logger.log('JWT Payload:', payload);
    return {
      userId: payload.sub, // זה יהיה ה-ID של המשתמש
      email: payload.email,
    };
  }
} 