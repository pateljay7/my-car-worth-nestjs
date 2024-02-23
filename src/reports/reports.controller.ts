import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post()
  createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }

  @Get()
  getAllReports() {
    return this.reportsService.find();
  }
}
