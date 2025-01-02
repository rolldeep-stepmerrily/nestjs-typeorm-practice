import { HttpStatus } from '@nestjs/common';

export const GLOBAL_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'internal server error',
    errorCode: 'E0000',
  },
  INVALID_REQUEST: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'invalid request',
    errorCode: 'E0001',
  },
  USERNAME_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    message: 'username already exists',
    errorCode: 'E0002',
  },
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'user not found',
    errorCode: 'E0003',
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'invalid password',
    errorCode: 'E0004',
  },
  INVALID_TOKEN: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'invalid token',
    errorCode: 'E0005',
  },
  FORBIDDEN: {
    statusCode: HttpStatus.FORBIDDEN,
    message: 'forbidden',
    errorCode: 'E0006',
  },
  POST_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'post not found',
    errorCode: 'E0007',
  },
  WITHDRAWAL_USER: {
    statusCode: HttpStatus.GONE,
    message: 'withdrawal user',
    errorCode: 'E0008',
  },
};
