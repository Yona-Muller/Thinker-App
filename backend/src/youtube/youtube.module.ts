import { Module } from '@nestjs/common';
// import { YouTubeController } from './youtube.controller';
import { YouTubeService } from './youtube.service';

@Module({
  // controllers: [YouTubeController],
  providers: [YouTubeService],
  exports: [YouTubeService]
})
export class YouTubeModule {} 