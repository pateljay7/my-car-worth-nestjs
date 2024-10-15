import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Report } from './report.entity';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';

@Entity({})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  // to exclude field in response using @UseInterceptors(ClassSerializerInterceptor)
  // but it will apply on entity level instead of route level
  // @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedRequests: FriendRequest[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @BeforeInsert()
  encryptPassword() {
    console.log('Insert for ', this.password, this.email);
    return { password: 'jay', email: this.email };
  }
}
