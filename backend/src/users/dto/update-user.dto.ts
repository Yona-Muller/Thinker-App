import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity'; 

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'newpassword123',
    required: false,
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  otpCode?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  optExpiration?: Date;
}
