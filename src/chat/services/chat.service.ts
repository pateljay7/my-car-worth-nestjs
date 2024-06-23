import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ChatService {
  constructor(@InjectQueue('chat-queue') private readonly chatQueue: Queue) {}

  async addMessageToQueue(room: string, message: string): Promise<void> {
    await this.chatQueue.add({ room, message });
  }
}
