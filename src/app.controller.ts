import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  getHello() {
    return this.appService.getHello();
  }
}
