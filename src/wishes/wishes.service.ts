import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { OfferAlreadyExistsException } from './exceptions/offer-already-exists.exception';
import { RaisedChangeException } from './exceptions/raised-change.exception';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}
  async create(ownerId: number, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.create({
      ...createWishDto,
      raised: 0,
      copied: 0,
      owner: { id: ownerId },
    });
    return await this.wishRepository.save(wish);
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true, wishlists: true },
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true, wishlists: true },
      order: { copied: 'DESC' },
      take: 10,
    });
    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: { owner: true, items: true },
          },
          item: true,
        },
        wishlists: true,
      },
    });
    return wish;
  }

  async isOwner(userId: number, wishId: number): Promise<boolean> {
    const wish = await this.findOne(wishId);
    return wish.owner.id == userId;
  }

  async findCountOffer(id: number): Promise<number> {
    const wish = await this.findOne(id);
    return wish.offers.length;
  }

  async checkAndUpdate(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const { price, raised } = updateWishDto;
    if (!(await this.findOne(wishId))) {
      throw new NotFoundException();
    }
    if (!(await this.isOwner(userId, wishId))) {
      throw new ForbiddenException();
    }
    if (price > 0 && (await this.findCountOffer(wishId)) > 0) {
      throw new OfferAlreadyExistsException();
    }
    if (raised > 0) {
      throw new RaisedChangeException();
    }
    return this.updateOne(wishId, updateWishDto);
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.findOne(id);
    await this.wishRepository.update({ id }, updateWishDto);
    return wish;
  }

  async checkAndRemove(userId: number, wishId: number): Promise<Wish> {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException();
    }
    if (!(await this.isOwner(userId, wishId))) {
      throw new ForbiddenException();
    }
    if ((await this.findCountOffer(wishId)) > 0) {
      throw new OfferAlreadyExistsException();
    }
    return await this.remove(wishId);
  }

  async remove(id: number): Promise<Wish> {
    const wish = await this.findOne(id);
    await this.wishRepository.delete({ id });
    return wish;
  }

  async copy(userId: number, wishId: number): Promise<Wish> {
    const wish = await this.findOne(wishId);
    const { name, link, image, price, description } = wish;
    await this.updateOne(wishId, { copied: ++wish.copied });
    const newWish = await this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      raised: 0,
      copied: 0,
      owner: { id: userId },
    });
    return await this.wishRepository.save(newWish);
  }
}
