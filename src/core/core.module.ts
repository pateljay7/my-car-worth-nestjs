import { Module } from '@nestjs/common';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

@Module({
  providers: [SerializeInterceptor],
  exports: [SerializeInterceptor],
})
export class CoreModule {}
