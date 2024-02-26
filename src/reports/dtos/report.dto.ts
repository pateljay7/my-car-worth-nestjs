import { Expose, Transform, plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: Date;

  @Expose()
  lng: Date;

  @Expose()
  lat: Date;

  @Transform(({ obj }) => {
    // return obj.user?.id;
    // data as per specified DTO
    return plainToInstance(UserDto, obj.user, {
      excludeExtraneousValues: true,
    });
  })
  @Expose()
  //   user: number;
  user: UserDto; // for return data as per DTO

  @Expose()
  mileage: Date;
}
