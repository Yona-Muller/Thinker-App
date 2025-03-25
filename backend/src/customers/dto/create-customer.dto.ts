import { IsString, IsOptional, IsEmail, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class CreateCustomerDto {
  @ApiProperty({
    description: 'Unique business identifier for the customer.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  businessId: string;

  @ApiProperty({
    description: 'The first name of the customer.',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The lest name of the customer.',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The email of the customer.',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+972501234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The address of the customer',
    example: '123, Main street, City',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The Country of the customer.',
    example: 'Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: "The latitude coordinate of the customer's location.",
    example: '32.085300',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: "The longitude coordinate of the customer's location.",
    example: '34.781800',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'The date of birth of the customer.',
    example: '1990-05-05',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({
    description: "A URL to the customer's profile picture.",
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
