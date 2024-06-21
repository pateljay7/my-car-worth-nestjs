import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email-queue')
export class EmailProcessorService {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async handleEmailJob(
    job: Job<{ to: string; subject: string; text: string }>,
  ) {
    const { to, subject, text } = job.data;
    try {
      await this.mailerService.sendMail({
        from: 'MCW(my car worth) pateljaykjp@gmail.com',
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
