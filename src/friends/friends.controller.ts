import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CurrentUser } from 'src/core/decorators/user.decortor';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(
    @CurrentUser() user: { id: number },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.friendsService.getFriends(user.id, +page, +limit);
  }

  @Delete(':friendId')
  async removeFriend(
    @CurrentUser() user: { id: number },
    @Param('friendId') friendId: number,
  ) {
    return await this.friendsService.removeFriend(user.id, friendId);
  }
}
