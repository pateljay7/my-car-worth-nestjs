import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from 'src/users/users.service';
/* 
  - Request object does't have user property
  - As we are adding user property by our end in JWT strategy
  - Need to update Request interface to use user property
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
//Middlware will call top of the JWT strategy and authGuard
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user || {};

    if (id) {
      const user = await this.usersService.findOne(id);
      req.user = user;
    }

    next();
  }
}
