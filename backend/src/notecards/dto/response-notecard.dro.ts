import { ApiProperty } from '@nestjs/swagger';

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
    description: 'The content of the note card.',
    example: 'React state can be managed using Context API, Redux, or Recoil.',
  })
  content: string;

  @ApiProperty({
    description: 'The category or tag for the note card.',
    example: 'Frontend Development',
  })
  category?: string;

  @ApiProperty({
    description: 'The creation timestamp of the note card.',
    example: '2025-03-27T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last updated timestamp of the note card.',
    example: '2025-03-28T14:30:00.000Z',
  })
  updatedAt: Date;
}
