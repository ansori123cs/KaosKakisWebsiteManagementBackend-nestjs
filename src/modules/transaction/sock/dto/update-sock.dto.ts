import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SockDetails {
  @ApiProperty()
  @IsString()
  name: string;
}

export class ResponseSockDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}
