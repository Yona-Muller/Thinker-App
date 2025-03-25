import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './utils/decorators/isPublic.decorator';
import { version } from '../package.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @IsPublic()
  @Get('version')
  getVersion() {
    return {
      version,
      gitHash: process.env.GIT_HASH || 'unknown',
    };
  }
}
