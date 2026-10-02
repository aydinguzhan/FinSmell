import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // forbidNonWhitelisted: true, // DTO'da olmayan alan gönderilirse hatayla reddeder
    }),

  );
  app.enableShutdownHooks();

  await app.listen(Number(configService.get<string>('PORT') ?? 3000));
}
await bootstrap();
