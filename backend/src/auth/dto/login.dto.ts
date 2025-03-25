import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginByPasswordDto {
  @IsString()
  @ApiProperty({ example: 'example@mail.com' })
  email: string;

  @ApiProperty({ example: 'MyPassword1234' })
  @IsString()
  password: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class LoginByOTPDto {
  @IsString()
  @ApiProperty({ example: 'example@mail.com' })
  email: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  code: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class GoogleOauthQueryDto {
  @ApiProperty({ example: 'google.sso.code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'stringify.object' })
  @IsString()
  state: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the logout was successful' })
  success: boolean;
}
