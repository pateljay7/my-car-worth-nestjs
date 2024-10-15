import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'src/database/entities/friend-request.entity';
import { Repository } from 'typeorm';
import { Friend } from 'src/database/entities/friend.entity';
import { User } from 'src/database/entities/user.entity';
import { FRIEND_REQUEST_STATUS } from './constants';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Send a friend request
  async sendFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new HttpException(
        'You cannot send a friend request to yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if users are already friends
    const friendshipExists = await this.friendRepository.findOne({
      where: [
        { user: { id: senderId }, friend: { id: receiverId } },
        { user: { id: receiverId }, friend: { id: senderId } },
      ],
    });

    if (friendshipExists) {
      throw new HttpException(
        'You are already friends with this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if a pending friend request already exists
    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
          status: FRIEND_REQUEST_STATUS.PENDING,
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
          status: FRIEND_REQUEST_STATUS.PENDING,
        },
      ],
    });

    if (existingRequest) {
      throw new HttpException(
        'A friend request is already pending',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If no friendship or pending request exists, create a new friend request
    const sender = await this.userRepository.findOneBy({ id: senderId });
    const receiver = await this.userRepository.findOneBy({ id: receiverId });

    if (!sender || !receiver) {
      throw new HttpException(
        'One or both users do not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
    });

    await this.friendRequestRepository.save(friendRequest);

    return { message: 'Friend request sent successfully' };
  }

  // Accept friend request
  async acceptFriendRequest(requestId: number, receiverId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: {
        id: requestId,
        receiver: { id: receiverId },
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) {
      throw new HttpException(
        'Friend request not found or already accepted',
        HttpStatus.NOT_FOUND,
      );
    }

    // Create a friendship when the request is accepted
    const friendship1 = this.friendRepository.create({
      user: friendRequest.sender,
      friend: friendRequest.receiver,
    });
    const friendship2 = this.friendRepository.create({
      user: friendRequest.receiver,
      friend: friendRequest.sender,
    });

    await this.friendRepository.save([friendship1, friendship2]);

    // Mark the friend request as accepted
    friendRequest.status = FRIEND_REQUEST_STATUS.ACCEPTED;
    await this.friendRequestRepository.save(friendRequest);

    return { message: 'Friend request accepted' };
  }

  async declineFriendRequest(requestId: number, receiverId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: {
        id: requestId,
        receiver: { id: receiverId },
        status: FRIEND_REQUEST_STATUS.DECLINED,
      },
    });

    if (!friendRequest) {
      throw new HttpException(
        'Friend request not found or already processed',
        HttpStatus.NOT_FOUND,
      );
    }

    // Decline and remove the friend request
    await this.friendRequestRepository.delete({ id: requestId });
    return { message: 'Friend request declined' };
  }

  async getPendingRequests(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ requests: FriendRequest[]; totalCount: number }> {
    const [requests, totalCount] =
      await this.friendRequestRepository.findAndCount({
        where: {
          receiver: { id: userId },
          status: FRIEND_REQUEST_STATUS.PENDING,
        },
        relations: ['sender'],
        skip: (page - 1) * limit,
        take: limit,
      });

    return { requests, totalCount };
  }
}
