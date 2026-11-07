import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

// @Controller() with no path means routes here start at the root: this one is GET /
@Controller()
export class AppController {
  // Dependency injection: Nest creates AppService and passes it in. We never call `new`.
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
