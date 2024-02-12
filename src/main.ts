import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const moduleRef = app.select(AppModule);
  // const reflector = moduleRef.get(Reflector);
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
