import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/database/entities/friend-request.entity';
import { Friend } from 'src/database/entities/friend.entity';
import { User } from 'src/database/entities/user.entity';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { UsersService } from 'src/users/users.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friend, User]),
    NotificationModule,
  ],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, UsersService, CurrentUserInterceptor],
})
export class FriendRequestsModule {}
