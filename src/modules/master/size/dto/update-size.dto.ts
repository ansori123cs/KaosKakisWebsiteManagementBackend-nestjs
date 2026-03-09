import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateSizeDto } from './create-size.dto';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @ApiProperty()
  @IsNumber()
  status: number;
}

export class ResponseSizeDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}
