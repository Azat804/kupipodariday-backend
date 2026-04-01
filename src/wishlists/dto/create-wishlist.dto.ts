import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { Column } from 'typeorm';

export class CreateWishlistDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
  'owner',
  'items',
] as const) {
  @Column()
  itemsId: number[];
}
