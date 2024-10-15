import {
  Controller,
  Post,
  Param,
  Req,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { CurrentUser } from 'src/core/decorators/user.decortor';

@Controller('friend-requests')
@UseInterceptors(CurrentUserInterceptor)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('send/:receiverId')
  async sendFriendRequest(@Req() req, @Param('receiverId') receiverId: number) {
    return await this.friendRequestsService.sendFriendRequest(
      req.user.id,
      receiverId,
    );
  }

  @Post('accept/:requestId')
  async acceptFriendRequest(@Req() req, @Param('requestId') requestId: number) {
    return await this.friendRequestsService.acceptFriendRequest(
      requestId,
      req.user.id,
    );
  }

  @Post('decline/:requestId')
  async declineFriendRequest(
    @Req() req,
    @Param('requestId') requestId: number,
  ) {
    return await this.friendRequestsService.declineFriendRequest(
      requestId,
      req.user.id,
    );
  }

  @Get('pending/')
  async getPendingRequests(
    @CurrentUser() user: { id: number },
    @Query() paginationDto: PaginationDto,
  ) {
    return this.friendRequestsService.getPendingRequests(
      user.id,
      paginationDto.page,
      paginationDto.limit,
    );
  }
}
