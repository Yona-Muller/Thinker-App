import { BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException, ConflictException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCodes {
  BAD_REQUEST = 'ERROR.BAD_REQUEST',
  UNAUTHORIZED = 'ERROR.UNAUTHORIZED',
  FORBIDDEN = 'ERROR.FORBIDDEN',
  NOT_FOUND = 'ERROR.NOT_FOUND',
  CONFLICT = 'ERROR.CONFLICT',
  INTERNAL_SERVER_ERROR = 'ERROR.INTERNAL_SERVER_ERROR',
  // Add more as needed
}

export class ExtendedBadRequestException extends BadRequestException {
  constructor(message: string = 'Bad Request', code: ErrorCodes = ErrorCodes.BAD_REQUEST) {
    super({ success: false, code, message });
  }
}

export class ExtendedUnauthorizedException extends UnauthorizedException {
  constructor(message: string = 'Unauthorized', code: ErrorCodes = ErrorCodes.UNAUTHORIZED) {
    super({ success: false, code, message });
  }
}

export class ExtendedNotFoundException extends NotFoundException {
  constructor(message: string = 'Not Found', code: ErrorCodes = ErrorCodes.NOT_FOUND) {
    super({ success: false, code, message });
  }
}

export class ExtendedForbiddenException extends ForbiddenException {
  constructor(message: string = 'Forbidden', code: ErrorCodes = ErrorCodes.FORBIDDEN) {
    super({ success: false, code, message });
  }
}

export class ExtendedConflictException extends ConflictException {
  constructor(message: string = 'Conflict', code: ErrorCodes = ErrorCodes.CONFLICT) {
    super({ success: false, code, message });
  }
}

export class ExtendedInternalServerErrorException extends InternalServerErrorException {
  constructor(message: string = 'Internal Server Error', code: ErrorCodes = ErrorCodes.INTERNAL_SERVER_ERROR) {
    super({ success: false, code, message });
  }
}

export function handleUnexpectedError(error: Error): never {
  console.error('Unexpected error:', error);
  throw new ExtendedInternalServerErrorException('An unexpected error occurred');
}

export function assertNotFound<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new ExtendedNotFoundException(message);
  }
}
