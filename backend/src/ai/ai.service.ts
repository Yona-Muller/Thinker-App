import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly pythonServiceUrl = 'http://localhost:5000';

  async generateIdeas(text: string, model: 'openai' | 'gemini' | 'deepseek'): Promise<string[]> {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/analyze`, {
        text,
        model
      });
      
      return response.data.ideas;
    } catch (error) {
      throw new HttpException(
        'Failed to generate ideas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
