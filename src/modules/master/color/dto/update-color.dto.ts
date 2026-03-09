import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @ApiProperty()
  @IsNumber()
  status: number;
}

export class ResponseColorDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}
