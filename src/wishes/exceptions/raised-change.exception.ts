import { HttpException, HttpStatus } from '@nestjs/common';

export class RaisedChangeException extends HttpException {
  constructor() {
    super(
      'Сумма собранных средств недоступна для изменения',
      HttpStatus.BAD_REQUEST,
    );
  }
}
