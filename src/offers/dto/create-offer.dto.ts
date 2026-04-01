import { OmitType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { Column } from 'typeorm';
import { IsInt } from 'class-validator';

export class CreateOfferDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
  'user',
  'item',
] as const) {
  @IsInt()
  @Column()
  itemId: number;
}
