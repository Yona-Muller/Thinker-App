import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: twilio.Twilio;
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not found in environment variables');
    }

    this.twilioClient = twilio(accountSid, authToken);
  }

  async sendSMS(to: string, message: string) {
    try {
      const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      const result = await this.twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: to,
      });

      this.logger.log(`SMS sent successfully to ${to}, Message SID: ${result.sid}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }
}
