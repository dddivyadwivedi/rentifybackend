import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Like } from '../likes/likes.entity';

@Entity()
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  propertyImageLink: string;

  @Column({ default: null })
  location: string;

  @Column({ default: null })
  noOfBedrooms: number;

  @Column({ default: null })
  noOfBathrooms: number;

  @Column({ default: null })
  noOfHospitalsNearBy: number;

  @Column({ default: null })
  price: string;

  @ManyToOne(() => User, (user) => user.propertiesOwned)
  seller: User;
  @Column({ default: null })
  sellerId: number;

  @ManyToMany(() => User, (user) => user.propertiesInterested)
  buyers: User[];

  @OneToMany(() => Like, like => like.property)
  likes: Like[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
