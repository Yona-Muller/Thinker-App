import { IsOptional, IsEnum, IsString, IsDate, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'newpassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'The OTP code for the user',
    example: 123456,
    required: false,
  })
  @IsOptional()
  @IsInt()
  otpCode?: number;

  @ApiProperty({
    description: 'The OTP expiration date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  optExpiration?: Date;
}
