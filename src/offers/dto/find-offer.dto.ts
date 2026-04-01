import { PartialType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';

export class FindOfferDto extends PartialType(Offer) {}
