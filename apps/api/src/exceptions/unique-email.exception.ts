import { HttpException, HttpStatus } from '@nestjs/common';
import { EMAIL_ALREADY_EXISTS, HTTP_BAD_REQUEST } from 'shared';

export class UniqueEmailException extends HttpException {
  constructor(email: string)  {
    super({ message: EMAIL_ALREADY_EXISTS, error: HTTP_BAD_REQUEST, description: `Email '${email}' is already in use.` }, HttpStatus.BAD_REQUEST);
  }
}