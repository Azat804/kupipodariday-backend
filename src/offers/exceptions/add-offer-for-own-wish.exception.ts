import { HttpException, HttpStatus } from '@nestjs/common';

export class AddOfferForOwnWishException extends HttpException {
  constructor() {
    super(
      'Нельзя вносить деньги на собственный подарок',
      HttpStatus.BAD_REQUEST,
    );
  }
}
