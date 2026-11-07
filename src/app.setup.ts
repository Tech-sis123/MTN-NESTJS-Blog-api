import { INestApplication, ValidationPipe } from '@nestjs/common';

// Settings shared by the real server (main.ts) and the e2e tests, so both behave the same.
export function configureApp(app: INestApplication) {
  // Global validation: every @Body() is checked against its DTO before the controller runs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drop any field the DTO doesn't declare...
      forbidNonWhitelisted: true, // ...or rather, reject the request with 400 if one is sent
      transform: true, // hand controllers a real DTO instance instead of a plain object
    }),
  );
}
