import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Length, IsUrl, IsString } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
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
  @Length(0, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  @IsString()
  image: string;

  @ManyToOne(() => User, (owner) => owner.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (item) => item.wishlists)
  @JoinTable()
  items: Wish[];
}
