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
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import {
  ResponseMaterialDto,
  UpdateMaterialDto,
} from './dto/update-material.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  MasterDataDetailDto,
  MasterDataPaginatedDto,
} from './dto/query-material.dto';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateMaterialDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @ApiOkResponse({ type: MasterDataPaginatedDto })
  @ApiNotFoundResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.materialService.findAll(limit, offset);
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
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Updated Successfully',
    type: ResponseMaterialDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Deleted Successfully',
    type: ResponseMaterialDto,
  })
  remove(@Param('id') id: string) {
    return this.materialService.remove(id);
  }
}
