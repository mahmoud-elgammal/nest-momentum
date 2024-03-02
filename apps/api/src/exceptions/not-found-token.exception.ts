import { HttpException, HttpStatus } from '@nestjs/common';
import { HTTP_NOT_FOUND } from 'shared';

export class NotFoundException extends HttpException {
  /**
   * @param condition string or object describing the error condition.
   * @param description a short description of the HTTP error.
   */
  constructor(condition?: string | Record<string, unknown> | any, description = HTTP_NOT_FOUND) {
    super(HttpException.createBody(condition, description, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
  }
}