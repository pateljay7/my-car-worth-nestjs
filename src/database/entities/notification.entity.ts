import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User; // The sender of the notification (e.g., who sent the friend request)

  @ManyToOne(() => User, (user) => user.notifications)
  user: User; // The recipient of the notification

  @Column()
  type: string; // Type of notification

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>; // Additional data for the notification

  @Column({ default: false })
  isRead: boolean; // Whether the notification has been read

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
