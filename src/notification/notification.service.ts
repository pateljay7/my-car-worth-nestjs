import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/database/entities/user.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from 'src/database/entities/notification.entity';

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

    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      data: notification.data,
      createdAt: notification.createdAt,
      sender: {
        id: notification.sender.id,
        name: `${notification.sender.first_name} ${notification.sender.last_name}`,
      },
      user: {
        id: notification.user.id,
        email: notification.user.email,
      },
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      transformedNotifications,
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

  async getNotificationByFriendRequestId(friendRequestId: number) {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .where("notification.data->>'friendRequestId' = :friendRequestId", {
        friendRequestId,
      })
      .orderBy('notification.createdAt', 'DESC') // Optional: to get the latest notification first
      .getOne(); // Fetches only one notification

    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found.`);
    }

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }
}
