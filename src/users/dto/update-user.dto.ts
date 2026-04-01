import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Column } from 'typeorm';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  @IsString()
  @IsOptional()
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
    select: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @Column({
    select: false,
  })
  @IsOptional()
  @IsString()
  password: string;
}
