import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { plainToInstance, Transform } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Transform(({ obj }) => {
    // return obj.user?.id;
    // data as per specified DTO
    return plainToInstance(UserDto, obj.user, {
      excludeExtraneousValues: true,
    });
  })
  @ManyToOne(() => User, (user) => user.friends)
  user: User;

  @Transform(({ obj }) => {
    // return obj.user?.id;
    // data as per specified DTO
    return plainToInstance(UserDto, obj.user, {
      excludeExtraneousValues: true,
    });
  })
  @ManyToOne(() => User)
  friend: User;
}
