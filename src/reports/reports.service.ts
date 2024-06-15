import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/database/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(body: CreateReportDto, userId: number) {
    try {
      const report = this.reportRepo.create(body);
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('userNotFound', HttpStatus.NOT_FOUND);
      }
      report.user = user;
      return this.reportRepo.save(report);
    } catch (error) {
      throw new Error(error);
    }
  }

  async find() {
    try {
      return this.reportRepo.find({ relations: ['user'] });
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    return this.reportRepo.save(report);
  }
}
