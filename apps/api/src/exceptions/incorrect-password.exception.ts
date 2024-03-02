import { HttpException, HttpStatus } from '@nestjs/common';
import { INCORRECT_PASSWORD  } from 'shared';

export class IncorrectPasswordException extends HttpException {
  constructor()  {
    super({ message: INCORRECT_PASSWORD, description: null }, HttpStatus.UNAUTHORIZED);
  }
}