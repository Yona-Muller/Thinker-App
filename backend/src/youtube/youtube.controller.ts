import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { YouTubeService } from './youtube.service';

@Controller('youtube')
@UseGuards(JwtAuthGuard)
export class YouTubeController {
  constructor(private readonly youtubeService: YouTubeService) {}

  @Get('video-info/:videoId')
  async getVideoInfo(@Param('videoId') videoId: string) {
    console.log('Getting video info for:', videoId);
    return this.youtubeService.getVideoInfo(videoId);
  }
}