import { Test, TestingModule } from '@nestjs/testing';
import { ChatProcessorService } from './chat-processor.service';

describe('ChatProcessorService', () => {
  let service: ChatProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatProcessorService],
    }).compile();

    service = module.get<ChatProcessorService>(ChatProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
