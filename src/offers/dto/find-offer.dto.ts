import { OmitType, PartialType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { ManyToOne } from 'typeorm';

export class FindOfferDto extends PartialType(Offer) {}
