import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferLimitException extends HttpException {
  constructor() {
    super(
      'Сумма собранных средств не может превышать стоимость подарка',
      HttpStatus.BAD_REQUEST,
    );
  }
}
