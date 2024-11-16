import { IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  userId: number; // Recipient ID

  @IsNotEmpty()
  senderId: number; // Sender ID

  @IsEnum(['friend-request', 'post-like', 'comment'])
  type: string;

  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
