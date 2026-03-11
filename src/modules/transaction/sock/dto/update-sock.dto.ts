import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateSockDto } from './create-sock.dto';

export class UpdateSockDto extends PartialType(CreateSockDto) {
  @ApiProperty()
  @IsNumber()
  status: number;
}

export class ResponseSockDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}
