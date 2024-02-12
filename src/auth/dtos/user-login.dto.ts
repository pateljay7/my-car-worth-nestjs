import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'email not provided' })
  public email: string;

  @IsString()
  @IsNotEmpty({ message: 'password not provided' })
  public password: string;
}
