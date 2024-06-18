import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();

    if (!request.user)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { id } = request?.user;

    if (!id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      request.user = user;
      console.log('Current User Interceptor ::', request.user);
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return next.handle();
  }
}
