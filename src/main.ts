import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global validation: every @Body() is checked against its DTO before the controller runs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drop any field the DTO doesn't declare...
      forbidNonWhitelisted: true, // ...or rather, reject the request with 400 if one is sent
      transform: true, // hand controllers a real DTO instance instead of a plain object
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
