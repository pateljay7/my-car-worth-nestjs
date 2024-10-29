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
}
