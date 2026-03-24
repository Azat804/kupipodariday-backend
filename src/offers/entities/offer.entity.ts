import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Contains, Length, IsEmail } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean;

  @ManyToMany(() => User, (user) => user.offers)
  @JoinTable()
  user: User[];

  @ManyToOne(() => Wish, (item) => item.offers)
  item: Wish;
}
