import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [UsersModule, ReportsModule, DatabaseModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
