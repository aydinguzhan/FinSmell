import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ResponseFormatInterceptor } from './conf/inceptor/transform.inceptor.js';

@Controller()
@UseInterceptors(ResponseFormatInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
