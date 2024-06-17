import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/core/decorators/user.decortor';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminAuthGuard } from 'src/core/guards/admin.guard';

@Controller('reports')
@Serialize(ReportDto)
@UseInterceptors(CurrentUserInterceptor)
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
  @UseGuards(AdminAuthGuard)
  getAllReports() {
    return this.reportsService.find();
  }

  @Patch('/:id')
  @UseGuards(AdminAuthGuard)
  approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
    const { approve } = body;
    return this.reportsService.changeApproval(id, approve);
  }
}
