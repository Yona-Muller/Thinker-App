import { ApiProperty } from '@nestjs/swagger';
import { NoteCardType } from '../entities/notecard.entity';

export class ResponseNoteCardDto {
  @ApiProperty({
    description: 'Unique identifier of the note card.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the note card.',
    example: 'React State Management',
  })
  title: string;

  @ApiProperty({
    description: 'The source URL of the content.',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  sourceUrl: string;

  @ApiProperty({
    description: 'The type of source.',
    example: 'youtube',
    enum: NoteCardType,
  })
  sourceType: NoteCardType;

  @ApiProperty({
    description: 'Key takeaways from the content.',
    example: ['Hooks simplify state', 'useReducer for complex state logic'],
  })
  keyTakeaways?: string[];

  @ApiProperty({
    description: 'Personal thoughts about the content.',
    example: ['This was a great introduction to hooks'],
  })
  thoughts?: string[];

  @ApiProperty({
    description: 'Tags for categorization.',
    example: ['React', 'Frontend'],
  })
  tags?: string[];

  @ApiProperty({
    description: 'Thumbnail URL of the content.',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'The name of the channel or source.',
    example: 'Academind',
  })
  channelName?: string;

  @ApiProperty({
    description: 'The avatar of the channel or author.',
    example: 'https://example.com/avatar.jpg',
  })
  channelAvatar?: string;

  @ApiProperty({
    description: 'The timestamp of when the note card was created.',
    example: '2025-03-27T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp of the last update.',
    example: '2025-03-28T14:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the user who created the note card.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Indicates whether the note card is active.',
    example: true,
  })
  isActive: boolean;
}
