import { HttpException, HttpStatus } from '@nestjs/common';
import { HTTP_BAD_REQUEST } from 'shared';

export class BadRequestException extends HttpException {
  /**
   * @param condition string or object describing the error condition.
   * @param description a short description of the HTTP error.
   */
  constructor(condition?: string | Record<string, unknown> | any, description = HTTP_BAD_REQUEST) {
    super(HttpException.createBody(condition, description, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
  }
}