import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  isString,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateSockDto } from './create-sock.dto';
import { Type } from 'class-transformer';

export class UpdateSockDto extends PartialType(CreateSockDto) {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  imageIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  urls: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  thumbnails: string[];
}

export class ResponseSockDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}

class SelectOptionDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsUUID()
  value: string;
}

export class DetailSockDto extends PartialType(UpdateSockDto) {
  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectMaterial: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectMachines: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectSizes: SelectOptionDto[];

  @ApiProperty({ type: [SelectOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  selectColors: SelectOptionDto[];
}
