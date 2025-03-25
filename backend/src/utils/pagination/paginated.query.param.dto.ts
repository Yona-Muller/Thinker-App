import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value) ?? 1)
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items per page',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value) ?? 100)
  limit?: number = 100;
}
