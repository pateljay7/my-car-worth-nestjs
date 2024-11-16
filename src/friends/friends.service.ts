import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/database/entities/friend.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {}

  async getFriends(
    userId: number,
    page: number,
    limit: number,
    searchTerm: string,
  ) {
    const [friends, totalCount] = await this.friendRepository.findAndCount({
      where: {
        user: { id: userId },
        friend: [
          { first_name: ILike(`%${searchTerm}%`) },
          { last_name: ILike(`%${searchTerm}%`) },
          { email: ILike(`%${searchTerm}%`) },
        ],
      },
      relations: ['friend'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      friends,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async removeFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new HttpException(
        'You cannot unfriend yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendship = await this.friendRepository.findOne({
      where: [
        { user: { id: userId }, friend: { id: friendId } },
        { user: { id: friendId }, friend: { id: userId } },
      ],
    });

    if (!friendship) {
      throw new HttpException('Friendship not found', HttpStatus.NOT_FOUND);
    }

    await this.friendRepository.remove(friendship);
    return { message: 'Friend removed successfully' };
  }

  async suggestFriends(userId: number, page: number, limit: number) {
    const userFriends = await this.friendRepository.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });

    const userFriendIds = userFriends.map((friend) => friend.friend.id);

    // Get users who are friends of the user's friends
    const mutualFriends = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.friend', 'friendOfFriend')
      .leftJoin('friend.user', 'friendUser')
      .where('friendUser.id IN (:...userFriendIds)', { userFriendIds })
      .andWhere('friendOfFriend.id != :userId', { userId })
      .andWhere('friendOfFriend.id NOT IN (:...excludedIds)', {
        excludedIds: [...userFriendIds, userId],
      })
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();

    // Remove duplicates and map to User objects
    const suggestedUsers = mutualFriends.map((mf) => mf.friend);

    return {
      suggestedUsers,
      totalCount: mutualFriends.length,
      currentPage: page,
    };
  }
}
