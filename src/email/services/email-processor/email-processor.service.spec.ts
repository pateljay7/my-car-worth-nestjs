import { Test, TestingModule } from '@nestjs/testing';
import { EmailProcessorService } from './email-processor.service';

describe('EmailProcessorService', () => {
  let service: EmailProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailProcessorService],
    }).compile();

    service = module.get<EmailProcessorService>(EmailProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
