import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailService } from './utils/mail/mail.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_EXPIRATION_TIME } from './auth/constants';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.${process.env.NODE_ENV}.env`,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRATION_TIME },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
