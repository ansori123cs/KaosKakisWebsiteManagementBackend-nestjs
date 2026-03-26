import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SockService } from './sock.service';
import { CreateSockDto } from './dto/create-sock.dto';
import { ResponseSockDto, UpdateSockDto } from './dto/update-sock.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PocketBaseAuthGuard } from 'src/common/guards/pocketbase-auth.guard';

@ApiTags('Transaction - Sock')
@Controller('/transaction/kaos-kaki')
export class SockController {
  constructor(private readonly sockService: SockService) {}

  @Get()
  @ApiOkResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.sockService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Detail Item Successfully',
  })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('Wrong ID format'),
      }),
    )
    id: string,
  ) {
    return this.sockService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10)) // max 10 gambar, field name = "images"
  @UseGuards(PocketBaseAuthGuard)
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateSockDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createSockDto: CreateSockDto,
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.sockService.create(createSockDto, files);
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
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.sockService.update(id, updateSockDto, files);
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
