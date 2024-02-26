import { Expose } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  updated_at: Date;

  @Expose()
  created_at: Date;
}
