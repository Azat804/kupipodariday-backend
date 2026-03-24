import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Contains, Length, IsEmail, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => Wish, (wish) => wish.owner)
  owner: User;

  @ManyToMany(() => Wish, (item) => item.wishlists)
  @JoinTable()
  items: Wish[];
}
