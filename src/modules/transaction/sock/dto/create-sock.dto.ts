import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Variation {
  @ApiProperty()
  @IsUUID()
  color: string;

  @ApiProperty()
  @IsUUID()
  size: string;
}

class Photo {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsBoolean()
  primary: boolean;
}

export class CreateSockDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  code: string;

  @ApiProperty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  description: string;

  @ApiProperty()
  @IsUUID()
  material: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  machine: string[];

  @ApiProperty({ type: [Variation] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variation)
  variations: Variation[];

  @ApiProperty({ type: [Photo] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Photo)
  photos: Photo[];
}
