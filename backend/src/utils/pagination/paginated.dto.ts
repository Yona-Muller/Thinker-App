import { Type } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export function createPaginatedResponseDto<T>(classRef: ClassConstructor<T>) {
  class MetadataDto {
    @IsInt()
    @Min(0)
    total: number;

    @IsInt()
    @Min(1)
    page: number;

    @IsInt()
    @Min(1)
    limit: number;

    @IsInt()
    @Min(0)
    totalPages: number;
  }

  class GenericPaginatedResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => classRef)
    data: T[];

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata: MetadataDto;
  }

  return GenericPaginatedResponseDto;
}
