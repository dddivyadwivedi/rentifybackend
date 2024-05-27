// src/comment.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Property } from '../property/property.entity';
import { User } from '../user/user.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes)
  buyer: User;
  @Column({ default: null })
  buyerId: number;

  @ManyToOne(() => Property, property => property.likes)
  property: Property;
  @Column({ default: null })
  propertyId: number;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
