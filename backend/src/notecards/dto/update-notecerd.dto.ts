import { IsString, IsOptional, IsEnum, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoteCardType } from '../entities/notecard.entity';

export class UpdateNoteCardDto {
  @ApiProperty({
    description: 'Updated title of the note card.',
    example: 'Advanced React Hooks',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Updated source URL of the content.',
    example: 'https://www.youtube.com/watch?v=abcd1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  sourceUrl?: string;

  @ApiProperty({
    description: 'Updated type of the source.',
    example: 'article',
    enum: NoteCardType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NoteCardType)
  sourceType?: NoteCardType;

  @ApiProperty({
    description: 'Updated key takeaways.',
    example: ['State management best practices'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyTakeaways?: string[];

  @ApiProperty({
    description: 'Updated personal thoughts.',
    example: ['This will help in building better applications'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  thoughts?: string[];

  @ApiProperty({
    description: 'Updated tags.',
    example: ['React', 'Best Practices'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Updated thumbnail URL.',
    example: 'https://example.com/new-thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Updated channel name.',
    example: 'Tech With Tim',
    required: false,
  })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiProperty({
    description: 'Updated channel avatar URL.',
    example: 'https://example.com/new-avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  channelAvatar?: string;
}
