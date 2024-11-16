import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get(':userId')
  async getNotifications(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.notificationsService.getNotifications(
      userId,
      +page,
      +limit,
    );
  }

  @Patch(':id')
  async markAsRead(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationsService.markAsRead(
      id,
      updateNotificationDto,
    );
  }
}
