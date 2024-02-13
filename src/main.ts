import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './core/guards/auth.guard';
const cookieSession = require('cookie-session');
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['skjnkakfnjabsnkfbksnvkj'],
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
  await app.listen(process.env.PORT, () => {
    console.log(`[ Server is runnig on port ${process.env.PORT}]`);
  });
}
bootstrap();
