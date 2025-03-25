import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { SendLinkDto } from './dto/send-link.dto';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private replaceLinkAndAlt(template: string, link: string | undefined, altText: string): string {
    if (link) {
      template = template.replace('{{link}}', link); // Replace the link placeholder
      template = template.replace('{{alt}}', altText); // Replace the alt text placeholder
    } else {
      template = template.replace('{{link}}', ''); // Remove link placeholder if no link
      template = template.replace('{{alt}}', ''); // Remove alt placeholder if no alt
    }
    return template;
  }

  private addAttachment(fileName: string, cid: string) {
    const assetPath = path.resolve(process.cwd(), 'src', 'utils', 'mail', 'assets', fileName);

    if (!fs.existsSync(assetPath)) {
      console.error(`Asset file not found: ${assetPath}`);
      throw new Error(`Asset file ${fileName} not found`);
    }

    return {
      filename: fileName,
      path: assetPath,
      cid,
    };
  }

  private prepareAttachments(sendMailDto: SendLinkDto) {
    const attachments = [];
    if (sendMailDto.googleWalletLink) {
      attachments.push(this.addAttachment('add_to_google_wallet-button.png', 'google-wallet-image'));
    }
    if (sendMailDto.appleWalletLink) {
      attachments.push(this.addAttachment('add_to_apple_wallet-button.png', 'apple-wallet-image'));
    }
    return attachments;
  }

  private handleWalletLinks(html: string, googleWalletLink: string, appleWalletLink: string): string {
    if (!googleWalletLink && !appleWalletLink) {
      return html.replace('{{walletLinks}}', '<p>Both Google Wallet and Apple Wallet links are unavailable at the moment. Please check back later.</p>');
    }
    return html.replace('{{walletLinks}}', '');
  }

  async sendEmail(sendMailDto: SendMailDto) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendLink(sendMailDto: SendLinkDto) {
    const templatePath = path.resolve(process.cwd(), 'src', 'utils', 'mail', 'templates', 'email-template.html');

    let html: string;
    try {
      html = fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read template file at ${templatePath}:`, error);
      throw new Error('Email template file not found');
    }

    html = this.replaceLinkAndAlt(html, sendMailDto.appleWalletLink, 'Add to Apple Wallet');

    html = this.handleWalletLinks(html, sendMailDto.googleWalletLink, sendMailDto.appleWalletLink);

    const attachments = this.prepareAttachments(sendMailDto);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      html: html,
      attachments: attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
