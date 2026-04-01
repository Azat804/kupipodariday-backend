import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferAlreadyExistsException extends HttpException {
  constructor() {
    super('Заявка уже существует', HttpStatus.BAD_REQUEST);
  }
}
