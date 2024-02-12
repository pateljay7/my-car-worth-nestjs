import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CoreModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
