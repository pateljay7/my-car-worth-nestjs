import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { BullModule } from '@nestjs/bull';
import { ChatProcessorService } from './services/chat-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chat-queue',
    }),
  ],
  providers: [ChatService, ChatGateway, ChatProcessorService],
})
export class ChatModule {}
