import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOfferDto } from './dto/find-offer.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { AddOfferForOwnWishException } from './exceptions/add-offer-for-own-wish.exception';
import { OfferLimitException } from './exceptions/offer-limit.exception';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async checkAndCreate(
    userId: number,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const { itemId, amount } = createOfferDto;
    const ownWishes = await this.usersService.findOwnWish(userId);
    const targetWish = await this.wishesService.findOne(itemId);
    if (ownWishes.findIndex((wish) => wish.id === itemId) !== -1) {
      throw new AddOfferForOwnWishException();
    }
    if (targetWish.raised + amount > targetWish.price) {
      throw new OfferLimitException();
    } else {
      await this.wishesService.updateOne(itemId, {
        raised: targetWish.raised + amount,
      });
      return this.create(userId, itemId, amount, createOfferDto);
    }
  }

  async create(
    userId: number,
    itemId: number,
    raised: number,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const offer = await this.offerRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      user: { id: userId },
      item: { id: itemId, raised },
    });
    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<FindOfferDto[]> {
    const offers = await this.offerRepository.find({
      relations: {
        item: true,
        user: {
          wishes: true,
          offers: true,
          wishlists: { owner: true, items: true },
        },
      },
    });
    return offers.filter((offer) => !offer.hidden);
  }

  async findOne(id: number): Promise<FindOfferDto> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: {
        item: true,
        user: {
          wishes: true,
          offers: true,
          wishlists: { owner: true, items: true },
        },
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }
    return offer.hidden ? {} : offer;
  }
}
