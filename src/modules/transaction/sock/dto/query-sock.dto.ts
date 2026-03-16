import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class SockDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  created_at: string;

  @ApiProperty()
  @IsNumber()
  status: number;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class SockPaginatedDto extends PaginatedDto<SockDto> {
  @ApiProperty({ type: SockDto, isArray: true })
  result: SockDto[];
}
