import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SockService } from './sock.service';
import { CreateSockDto } from './dto/create-sock.dto';
import { ResponseSockDto, UpdateSockDto } from './dto/update-sock.dto';

@ApiTags('Transaction - Sock')
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

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseSockDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSockDto: UpdateSockDto,
  ) {
    return this.sockService.update(id, updateSockDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseSockDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sockService.remove(id);
  }
}
