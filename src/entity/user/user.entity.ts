import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../property/property.entity';
import {  Like } from '../likes/likes.entity';
import { UserRole } from './userRole.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.buyer })
  role: UserRole;

  @Column({ default: null })
  @Exclude({ toPlainOnly: true })
  salt: string;

  @OneToMany(() => Property, (property) => property.seller)
  propertiesOwned: Property[];

  @ManyToMany(() => Property, (property) => property.buyers)
  propertiesInterested: Property[];

 
  @OneToMany(() => Like, like => like.buyer)
  likes: Like[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
