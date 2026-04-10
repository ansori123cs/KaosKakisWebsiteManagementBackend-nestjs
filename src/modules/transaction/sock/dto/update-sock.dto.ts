import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateSockDto } from './create-sock.dto';
import { Type } from 'class-transformer';

export class UpdateSockDto extends PartialType(CreateSockDto) {
  @ApiProperty()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsNumber()
  status?: number;
}

export class Image {
  @ApiProperty()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty()
  @IsString()
  imageId?: string;

  @ApiProperty()
  @IsString()
  url?: string;

  @ApiProperty()
  @IsString()
  thumbnail?: string;
}

export class ResponseSockDto {
  @ApiProperty()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsString()
  name?: string;
}

class SelectOptionDto {
  @ApiProperty()
  @IsString()
  label?: string;

  @ApiProperty()
  @IsUUID()
  value?: string;
}

export class DetailSockDto extends PartialType(UpdateSockDto) {
  @ApiProperty({ type: [Image] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images?: Image[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectMaterial?: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectMachines?: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectSizes?: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectColors?: SelectOptionDto[];
}
