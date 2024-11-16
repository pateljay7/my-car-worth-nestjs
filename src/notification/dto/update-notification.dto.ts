import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(['friend-request', 'post-like', 'comment'])
  type: string;

  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
