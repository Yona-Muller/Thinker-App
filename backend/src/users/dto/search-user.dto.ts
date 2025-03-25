import { IsOptional } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  email?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  id?: string;
}
