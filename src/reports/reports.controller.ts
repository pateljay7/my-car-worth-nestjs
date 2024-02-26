import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/core/decorators/user.decortor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post()
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: { userId: number },
  ) {
    return this.reportsService.create(body, user.userId);
  }

  @Get()
  getAllReports() {
    return this.reportsService.find();
  }
}
