import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username, about, avatar, email, password } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      username,
      about,
      avatar,
      email,
      password: hash,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
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

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  findMany(findUsersDto: FindUsersDto): Promise<User[]> {
    const { email, username } = findUsersDto;
    return this.userRepository.find({
      where: [{ email }, { username }],
    });
  }

  async updateOwn(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update({ id }, updateUserDto);
  }

  findOwnWish(id: number): Promise<User[]> {
    return this.userRepository.find({
      where: { id },
      select: {},
      relations: {
        wishes: true,
      },
    });
  }

  findOneWish(username: string): Promise<User[]> {
    return this.userRepository.find({
      where: { username },
      select: {},
      relations: {
        wishes: true,
      },
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
