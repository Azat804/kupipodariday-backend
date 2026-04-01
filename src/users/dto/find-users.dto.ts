import { Column } from 'typeorm';

export class FindUsersDto {
  @Column()
  query: string;
}
