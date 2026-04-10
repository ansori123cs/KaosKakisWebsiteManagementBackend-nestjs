import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/seeder')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  seeder() {
    return this.appService.seeder();
  }
}
