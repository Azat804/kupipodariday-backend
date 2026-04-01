import { OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';

export class CreateWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'owner',
  'offers',
  'wishlists',
] as const) {}
