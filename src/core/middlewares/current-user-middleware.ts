import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
//Middlware will call top of the JWT strategy and authGuard
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const { id } = req.user || {};

    if (id) {
      const user = await this.usersService.findOne(id);
      req.user = user;
    }

    next();
  }
}
