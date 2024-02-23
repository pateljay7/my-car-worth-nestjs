import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/database/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(body: CreateReportDto) {
    try {
      const report = this.repo.create(body);
      return this.repo.save(report);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find() {
    try {
      return this.repo.find();
    } catch (error) {
      throw new Error(error);
    }
  }
}
