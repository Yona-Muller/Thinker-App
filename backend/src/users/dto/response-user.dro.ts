import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.entity';

export class ResponseUserDto {
  @ApiProperty({ example: '07ea-f6ff-40bb-994b-71b8' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  username: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'USER' })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: true })
  isTemporaryPassword: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  passwordLastChanged: Date;

  @ApiProperty({ example: 60 })
  temporaryPasswordExpiry: number;

  @ApiProperty({ example: 'randomToken123' })
  passwordResetToken: string;

  @ApiProperty({ example: '2025-02-01T00:00:00Z' })
  passwordResetExpires: Date;

  @ApiProperty({ example: '2025-01-15T10:00:00Z' })
  lastLogin: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
    this.isTemporaryPassword = user.isTemporaryPassword;
    this.passwordLastChanged = user.passwordLastChanged;
    this.temporaryPasswordExpiry = user.temporaryPasswordExpiry;
    this.passwordResetToken = user.passwordResetToken;
    this.passwordResetExpires = user.passwordResetExpires;
    this.lastLogin = user.lastLogin;
  }
}
