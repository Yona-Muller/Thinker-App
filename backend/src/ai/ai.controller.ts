import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  async analyzeText(
    @Body() body: { text: string; model: 'openai' | 'gemini' | 'deepseek' }
  ) {
    return {
      ideas: await this.aiService.generateIdeas(body.text, body.model)
    };
  }
} 