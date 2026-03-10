import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SockService } from './sock.service';
import { CreateSockDto } from './dto/create-sock.dto';

@Controller('/transaction/kaos-kaki')
export class SockController {
  constructor(private readonly sockService: SockService) {}

  @Get()
  @ApiOkResponse()
  findAll() {
    return this.sockService.findAll();
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateSockDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createSockDto: CreateSockDto) {
    return this.sockService.create(createSockDto);
  }
}
