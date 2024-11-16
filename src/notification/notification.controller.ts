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
import { CurrentUser } from 'src/core/decorators/user.decortor';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get('')
  async getNotifications(
    @CurrentUser() user: { id: number },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.notificationsService.getNotifications(
      user.id,
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
