import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/database/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
