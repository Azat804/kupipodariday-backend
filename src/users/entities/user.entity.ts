import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import {
  Contains,
  Length,
  IsEmail,
  IsUrl,
  IsString,
  IsOptional,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  @IsString()
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
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
    select: false,
  })
  @IsEmail()
  email: string;

  @Column({
    select: false,
  })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ManyToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
