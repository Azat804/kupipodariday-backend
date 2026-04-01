import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { Wish } from './entities/wish.entity';
import { UpdateResult } from 'typeorm';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post('')
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(+req.user.id, createWishDto);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.checkAndUpdate(+req.user.id, +id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req): Promise<Wish> {
    return this.wishesService.checkAndRemove(+req.user.id, +id);
  }

  @Post(':id/copy')
  copy(@Req() req, @Param('id') wishId: string) {
    return this.wishesService.copy(+req.user.id, +wishId);
  }
}
