import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException();
      return false;
    }
    if (!request.user.admin) {
      throw new UnauthorizedException();
    }
    return request.user.admin;
  }
}
