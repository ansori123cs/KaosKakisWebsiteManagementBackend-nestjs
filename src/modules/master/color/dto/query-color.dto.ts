import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MasterDataDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  status: number;
}

export class MasterDataDetailDto extends PartialType(MasterDataDto) {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  created_at: string;

  @ApiProperty()
  @IsString()
  updated_at: string;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class MasterDataPaginatedDto extends PaginatedDto<MasterDataDto> {
  @ApiProperty({ type: MasterDataDto, isArray: true })
  result: MasterDataDto[];
}
