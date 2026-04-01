import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import * as bcrypt from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserAlreadyExistsEception } from './exceptions/user-already-exists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, about, avatar, email, password } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      about,
      avatar,
      email,
      password: hash,
    });
    if (
      (await this.findByUsername(username)) ||
      (await this.findByEmail(email))
    ) {
      throw new UserAlreadyExistsEception();
    }
    return this.userRepository.save(user);
  }

  findOwn(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      select: {
        email: true,
        username: true,
        id: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findByUsername(username: string, isSelectCredentials = false): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
      select: {
        email: isSelectCredentials,
        password: isSelectCredentials,
        username: true,
        id: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        username: true,
        id: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMany(findUsersDto: FindUsersDto): Promise<User[]> {
    const { query } = findUsersDto;
    return await this.userRepository.find({
      where: [{ email: query }, { username: query }],
      select: {
        email: true,
        username: true,
        id: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateOwn(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const { username, about, avatar, email, password } = updateUserDto;
    if (
      (username && (await this.findByUsername(username))) ||
      (email && (await this.findByEmail(email)))
    ) {
      throw new UserAlreadyExistsEception();
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      return await this.userRepository.update(
        { id },
        {
          username,
          about,
          avatar,
          email,
          password: hash,
        },
      );
    }
    return await this.userRepository.update(
      { id },
      {
        username,
        about,
        avatar,
        email,
      },
    );
  }

  async findOwnWish(id: number): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {},
      relations: {
        wishes: {
          owner: true,
          offers: {
            item: true,
            user: {
              wishes: true,
              offers: true,
              wishlists: { owner: true, items: true },
            },
          },
          wishlists: true,
        },
      },
    });
    return user.wishes;
  }

  async findOneWish(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {},
      relations: {
        wishes: { offers: true, wishlists: true },
      },
    });
    return user.wishes;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }
}
