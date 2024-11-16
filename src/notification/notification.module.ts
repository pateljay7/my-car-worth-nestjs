import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
