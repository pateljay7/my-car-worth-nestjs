import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './core/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  app.use(
    cookieSession({
      keys: [configService.get('COOKIE_KEY')],
    }),
  );
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(configService.get('PORT'), () => {
    console.log(`[ Server is runnig on port ${process.env.PORT}]`);
  });
}
bootstrap();
