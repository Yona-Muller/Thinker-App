import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { NoteCardsModule } from './notecards/notecards.module';
import { NoteCard } from './notecards/notecard.entity';
import { AuthModule } from './auth/auth.module';
import { YouTubeService } from './youtube/youtube.service';
import { YouTubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Shloimy-Yona',
      database: 'thinker_data',
      entities: [User, NoteCard],
      synchronize: false,
    }),
    UsersModule,
    NoteCardsModule,
    AuthModule,
    YouTubeModule,
  ],
  providers: [YouTubeService],
  exports: [YouTubeService],
})
export class AppModule {}// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from './users/users.module';
// import { NoteCardsModule } from './notecards/notecards.module';
// import { AuthModule } from './auth/auth.module'; // וודא שזה מיובא
// import { User } from './users/user.entity';
// import { NoteCard } from './notecards/notecard.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'Shloimy-Yona',
//       database: 'thinker_data',
//       entities: [User, NoteCard],
//       synchronize: false,
//     }),
//     UsersModule,
//     NoteCardsModule,
//     AuthModule, // וודא שזה נמצא כאן
//   ],
// })
// export class AppModule {}
