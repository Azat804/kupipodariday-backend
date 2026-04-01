import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { Column } from 'typeorm';
import { IsOptional } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {}
