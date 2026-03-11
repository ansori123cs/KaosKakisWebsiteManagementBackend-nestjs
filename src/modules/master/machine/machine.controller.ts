import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MasterDataDetailDto,
  MasterDataPaginatedDto,
} from './dto/query-machine.dto';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { ResponseMachineDto, UpdateMachineDto } from './dto/update-machine.dto';

@ApiTags('Master - Machine')
@Controller('/master/machines')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateMachineDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machineService.create(createMachineDto);
  }

  @Get()
  @ApiOkResponse({ type: MasterDataPaginatedDto })
  @ApiNotFoundResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.machineService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({ type: MasterDataDetailDto })
  @ApiNotFoundResponse()
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('Wrong ID format'),
      }),
    )
    id: string,
  ) {
    return this.machineService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseMachineDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() UpdateMachineDto: UpdateMachineDto,
  ) {
    return this.machineService.update(id, UpdateMachineDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseMachineDto,
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.machineService.remove(id);
  }
}
