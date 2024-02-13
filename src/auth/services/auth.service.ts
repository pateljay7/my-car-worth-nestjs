import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from '../jwt.strategy';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from '../dtos/user-login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtStrategy,
  ) {}

  async signup(data: CreateUserDto) {
    try {
      const matchedUser = await this.userService.find(data.email);
      if (matchedUser.length)
        throw new BadRequestException('Email is already registered.');
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(data.password, salt);
      const user = await this.userService.create({
        ...data,
        password: encryptedPassword,
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(data: UserLoginDto) {
    const { email, password } = data;
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid credential');
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid credential');
    }
    const accessToken = this.jwt.generateToken({
      userId: user.id.toString(),
    });
    return {
      accessToken,
      user,
    };
  }
}
