import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}
  async create(
    ownerId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = createWishlistDto;
    const wishlist = await this.wishlistRepository.create({
      name,
      image,
      owner: { id: ownerId },
      items: itemsId?.map((itemId) => ({
        id: itemId,
      })),
    });
    return await this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async isOwner(userId: number, wishlistId: number): Promise<boolean> {
    const wishlist = await this.findOne(wishlistId);
    return wishlist.owner.id === userId;
  }

  async checkAndUpdate(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    if (!(await this.findOne(wishlistId))) {
      throw new NotFoundException();
    }
    if (!(await this.isOwner(userId, wishlistId))) {
      throw new ForbiddenException();
    }
    return await this.updateOne(wishlistId, updateWishlistDto);
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = updateWishlistDto;
    const wishlist = await this.findOne(id);
    const newWishlist = await this.wishlistRepository.create({
      ...wishlist,
      name,
      image,
      items: itemsId?.map((itemId) => ({ id: itemId })),
    });
    return await this.wishlistRepository.save(newWishlist);
  }

  async checkAndRemove(userId: number, wishlistId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(wishlistId);
    if (!wishlist) {
      throw new NotFoundException();
    }
    if (!(await this.isOwner(userId, wishlistId))) {
      throw new ForbiddenException();
    }
    return await this.remove(wishlistId);
  }

  async remove(id: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    await this.wishlistRepository.delete({ id });
    return wishlist;
  }
}
