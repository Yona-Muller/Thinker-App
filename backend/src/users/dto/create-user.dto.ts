import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The username of the user (min 4 characters)',
    example: 'johndoe',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'The password of the user (min 8 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Indicates whether the user is active.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The role of the user',
    example: 'USER',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @ApiProperty({
    description: 'Indicates if the user has a temporary password',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isTemporaryPassword?: boolean = true;

  @ApiProperty({
    description: "The last time the user's password was changed",
    example: '2025-01-01T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  passwordLastChanged?: Date;

  @ApiProperty({
    description: 'The expiry duration of the temporary password in minutes',
    example: 60,
  })
  @IsOptional()
  temporaryPasswordExpiry?: number;

  @ApiProperty({
    description: 'The token used to reset the user password',
    example: 'randomToken123',
  })
  @IsString()
  @IsOptional()
  passwordResetToken?: string;

  @ApiProperty({
    description: 'The date and time when the password reset expires',
    example: '2025-02-01T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  passwordResetExpires?: Date;

  @ApiProperty({
    description: 'The last time the user logged in',
    example: '2025-01-15T10:00:00Z',
    type: Date,
  })
  @IsOptional()
  lastLogin?: Date;

  @ApiProperty({
    description: 'The IDs of the note cards associated with the user',
    example: ['1', '2', '3'],
  })
  @IsOptional()
  noteCardIds?: string[];
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The username of the user (min 4 characters)',
    example: 'johndoe',
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'The password of the user (min 8 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Indicates whether the user is active.',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The role of the user',
    example: 'USER',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Indicates if the user has a temporary password',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isTemporaryPassword?: boolean;

  @ApiProperty({
    description: "The last time the user's password was changed",
    example: '2025-01-01T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  passwordLastChanged?: Date;

  @ApiProperty({
    description: 'The expiry duration of the temporary password in minutes',
    example: 60,
  })
  @IsOptional()
  temporaryPasswordExpiry?: number;

  @ApiProperty({
    description: 'The token used to reset the user password',
    example: 'randomToken123',
  })
  @IsString()
  @IsOptional()
  passwordResetToken?: string;

  @ApiProperty({
    description: 'The date and time when the password reset expires',
    example: '2025-02-01T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  passwordResetExpires?: Date;

  @ApiProperty({
    description: 'The last time the user logged in',
    example: '2025-01-15T10:00:00Z',
    type: Date,
  })
  @IsOptional()
  lastLogin?: Date;

  @ApiProperty({
    description: 'The IDs of the note cards associated with the user',
    example: ['1', '2', '3'],
  })
  @IsOptional()
  noteCardIds?: string[];
}
