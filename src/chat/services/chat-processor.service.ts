import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatGateway } from '../gateway/chat.gateway';

@Processor('chat-queue')
export class ChatProcessorService {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Process()
  async handleChatMessage(
    job: Job<{ room: string; message: string }>,
  ): Promise<void> {
    const { room, message } = job.data;
    this.chatGateway.sendMessageToRoom(room, message);
  }
}
