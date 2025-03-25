import { ApiProperty } from '@nestjs/swagger';
import { Customers } from '../entities/customer.entity';

export class ResponseCustomerDto {
  @ApiProperty({
    description: 'The id of the customer.',
    example: '07ea-f6ff-40bb-994b-71b8',
  })
  id?: String;

  @ApiProperty({
    description: 'Unique business identifier for the customer.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  businessId: string;

  @ApiProperty({
    description: 'The first name of the customer.',
    example: 'john',
  })
  firstName?: string;

  @ApiProperty({
    description: 'The lest name of the customer.',
    example: 'Doe',
  })
  lastName?: string;

  @ApiProperty({
    description: "A URL to the customer's profile picture.",
    example: 'https://example.com/profile.jpg',
  })
  profilePicture?: string;

  @ApiProperty({
    description: 'The date of birth of the customer.',
    example: '1990-05-05',
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'The email of the customer.',
    example: 'johndoe@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+972501234567',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The address of the customer',
    example: '123, Main street, City',
  })
  address?: string;

  @ApiProperty({
    description: 'The Country of the customer.',
    example: 'Country',
  })
  country?: string;

  @ApiProperty({
    description: "The latitude coordinate of the customer's location.",
    example: '32.085300',
  })
  latitude?: number;

  @ApiProperty({
    description: "The longitude coordinate of the customer's location.",
    example: '34.781800',
  })
  longitude?: number;

  @ApiProperty({
    description: 'The date of create the customer.',
    example: '2024-12-08 13:52:23.74751',
  })
  createdDate: Date;

  @ApiProperty({
    description: 'The date of the lest modify the customer.',
    example: '2024-12-08 13:52:23.74751',
  })
  lastModifiedDate: Date;

  @ApiProperty({
    description: 'if the customer is active.',
    example: true,
  })
  isActive: boolean;
}
