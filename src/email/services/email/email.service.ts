import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.emailQueue.add({ to, subject, text });
    console.log('Email added to the Queue');
  }
}
