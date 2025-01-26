import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class YouTubeService {
  private youtube;
  private readonly logger = new Logger(YouTubeService.name);

  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      this.logger.error('YOUTUBE_API_KEY is not defined in environment variables');
      throw new Error('YOUTUBE_API_KEY is required');
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
  }

  async getVideoInfo(videoId: string) {
    this.logger.log(`Getting info for video ID: ${videoId}`);
    
    try {
      const videoResponse = await this.youtube.videos.list({
        part: ['snippet'],
        id: [videoId]
      });

      this.logger.log('Video API response:', videoResponse.data);

      if (!videoResponse.data.items?.length) {
        this.logger.error(`Video not found for ID: ${videoId}`);
        throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
      }

      const video = videoResponse.data.items[0];
      const channelId = video.snippet.channelId;

      const channelResponse = await this.youtube.channels.list({
        part: ['snippet'],
        id: [channelId]
      });

      this.logger.log('Channel API response:', channelResponse.data);

      const result = {
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        channelThumbnail: channelResponse.data.items[0].snippet.thumbnails.default.url
      };

      this.logger.log('Returning video info:', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching video info:', error);
      throw new HttpException(
        'Failed to fetch video info: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 