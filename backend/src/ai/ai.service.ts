import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  async generateSummary(input: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: `Summarize the following text:\n\n${input}`,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );
      return response.data.choices[0].text.trim();
    } catch (error) {
      throw new HttpException(
        'Failed to generate summary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
