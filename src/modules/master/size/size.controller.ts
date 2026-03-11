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
} from './dto/query-size.dto';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { ResponseSizeDto, UpdateSizeDto } from './dto/update-size.dto';

@ApiTags('Master - Size')
@Controller('/master/sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateSizeDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiOkResponse({ type: MasterDataPaginatedDto })
  @ApiNotFoundResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.sizeService.findAll(limit, offset);
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
    return this.sizeService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseSizeDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSizeDto: UpdateSizeDto,
  ) {
    return this.sizeService.update(id, updateSizeDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseSizeDto,
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sizeService.remove(id);
  }
}
