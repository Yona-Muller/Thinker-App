import { IsString, IsOptional, IsEnum, IsArray, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { NoteCardType } from '../entities/notecard.entity';

@ApiExtraModels()
export class CreateNoteCardDto {
  @ApiProperty({
    description: 'The title of the note card.',
    example: 'Understanding React Hooks',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The source URL of the content.',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    required: true,
  })
  @IsString()
  @IsUrl()
  sourceUrl: string;

  @ApiProperty({
    description: 'The type of source.',
    example: 'youtube',
    enum: NoteCardType,
    required: true,
  })
  @IsEnum(NoteCardType)
  sourceType: NoteCardType;

  @ApiProperty({
    description: 'Key takeaways from the content.',
    example: ['React Hooks simplify state management', 'useEffect replaces lifecycle methods'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyTakeaways?: string[];

  @ApiProperty({
    description: 'Personal thoughts about the content.',
    example: ['This concept is useful for managing side effects'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  thoughts?: string[];

  @ApiProperty({
    description: 'Tags for categorization.',
    example: ['React', 'Hooks', 'Frontend'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Thumbnail URL of the content.',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'The name of the channel or source.',
    example: 'Academind',
    required: false,
  })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiProperty({
    description: 'The avatar of the channel or author.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  channelAvatar?: string;

  @ApiProperty({
    description: 'The ID of the user who created the note card.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Indicates whether the note card is active.',
    example: true,
  })
  isActive: boolean;
}
