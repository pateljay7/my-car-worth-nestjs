// src/friend-requests/friend-request.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentRequests)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedRequests)
  receiver: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @CreateDateColumn()
  createdAt: Date;
}
