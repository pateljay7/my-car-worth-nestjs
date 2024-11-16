import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/database/entities/user.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { userId, senderId, ...rest } = createNotificationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!user) {
      throw new Error('Recipient user not found');
    }

    if (!sender) {
      throw new Error('Sender user not found');
    }

    const notification = this.notificationRepository.create({
      user,
      sender,
      ...rest,
    });

    return await this.notificationRepository.save(notification);
  }

  async getNotifications(userId: number, page = 1, limit = 10): Promise<any> {
    const [notifications, totalCount] =
      await this.notificationRepository.findAndCount({
        where: { user: { id: userId } },
        relations: ['sender', 'user'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      notifications,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async markAsRead(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }
}
