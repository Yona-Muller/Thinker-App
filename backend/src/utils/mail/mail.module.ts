import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService], // Register the MailService
  exports: [MailService], // Export it to make it available in other modules
})
export class MailModule {}
