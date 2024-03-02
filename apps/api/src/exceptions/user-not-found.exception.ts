import { HttpException, HttpStatus } from '@nestjs/common';
import { USER_NOT_FOUND } from 'shared';

export class UserNotFoundException extends HttpException {
  constructor(email?: string)  {
    super({ message: USER_NOT_FOUND, description: email && `email '${email}' not found already in use.` }, HttpStatus.NOT_FOUND);
  }
}