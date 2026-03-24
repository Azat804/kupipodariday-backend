import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Contains, Length, IsEmail, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
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
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: string[];

  @Column({
    type: 'integer',
  })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
