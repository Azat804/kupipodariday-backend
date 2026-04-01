import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { Offer } from './entities/offer.entity';
import { FindOfferDto } from './dto/find-offer.dto';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('')
  create(@Req() req, @Body() createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offersService.checkAndCreate(req.user.id, createOfferDto);
  }

  @Get()
  findAll(): Promise<FindOfferDto[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FindOfferDto> {
    return this.offersService.findOne(+id);
  }
}
