import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friend } from 'src/database/entities/friend.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
