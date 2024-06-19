import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { ReportsController } from './reports/reports.controller';

@Module({
  imports: [UsersModule, ReportsModule, DatabaseModule, CoreModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
