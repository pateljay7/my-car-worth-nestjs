import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('REQUEST URL::', req.method, req.baseUrl);
    req.query && console.log('REQUEST QUERY::', req.query);
    req.body && console.log('REQUEST BODY::', req.body);
    req.params && console.log('REQUEST PARAMA::', req.params);
    next();
  }
}
