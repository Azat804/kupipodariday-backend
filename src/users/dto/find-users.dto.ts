import { OmitType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';

export class FindUsersDto {
  @Column()
  query: string;
}
