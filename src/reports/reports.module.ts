import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/database/entities/report.entity';
import { User } from 'src/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
