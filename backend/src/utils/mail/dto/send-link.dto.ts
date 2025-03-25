import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class SendLinkDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsOptional()
  @IsUrl()
  googleWalletLink?: string;

  @IsOptional()
  @IsUrl()
  appleWalletLink?: string;
}
