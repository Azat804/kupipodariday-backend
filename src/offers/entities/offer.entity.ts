import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsNumber()
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @IsOptional()
  @IsBoolean()
  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (item) => item.offers)
  item: Wish;
}
