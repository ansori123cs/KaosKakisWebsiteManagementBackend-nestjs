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
} from './dto/query-color.dto';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { ResponseColorDto, UpdateColorDto } from './dto/update-color.dto';

@ApiTags('Master - Color')
@Controller('/master/colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateColorDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  @ApiOkResponse({ type: MasterDataPaginatedDto })
  @ApiNotFoundResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.colorService.findAll(limit, offset);
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
    return this.colorService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseColorDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseColorDto,
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.colorService.remove(id);
  }
}
