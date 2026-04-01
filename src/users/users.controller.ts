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
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findOwn(@Req() req): Promise<User> {
    return this.usersService.findOwn(+req.user.id);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Post('find')
  findMany(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    return this.usersService.findMany(findUsersDto);
  }

  @Patch('me')
  updateOwn(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.updateOwn(+req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  findOwnWish(@Req() req): Promise<Wish[]> {
    return this.usersService.findOwnWish(+req.user.id);
  }

  @Get(':username/wishes')
  findOneWish(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findOneWish(username);
  }

  @Delete('me')
  remove(@Req() req): Promise<DeleteResult> {
    return this.usersService.remove(+req.user.id);
  }
}
