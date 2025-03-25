import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: 'The email of the customer',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The first name of the customer.',
    example: 'john',
    required: false,
  })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The lest name of the customer.',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  lastName?: string;
}
