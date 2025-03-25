import { HttpStatus } from '@nestjs/common';

export enum SuccessCodes {
  OK = 'SUCCESS.OK',
  CREATED = 'SUCCESS.CREATED',
  ACCEPTED = 'SUCCESS.ACCEPTED',
  NO_CONTENT = 'SUCCESS.NO_CONTENT',
  PARTIAL_CONTENT = 'SUCCESS.PARTIAL_CONTENT',
}

export const successStatusMap: Record<SuccessCodes, HttpStatus> = {
  [SuccessCodes.OK]: HttpStatus.OK,
  [SuccessCodes.CREATED]: HttpStatus.CREATED,
  [SuccessCodes.ACCEPTED]: HttpStatus.ACCEPTED,
  [SuccessCodes.NO_CONTENT]: HttpStatus.NO_CONTENT,
  [SuccessCodes.PARTIAL_CONTENT]: HttpStatus.PARTIAL_CONTENT,
};

export interface SuccessResponse<T = any> {
  success: true;
  code: SuccessCodes;
  data?: T;
  message?: string;
}

export function successResponse<T>(code: SuccessCodes, data?: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    code,
    data,
    message,
  };
}
