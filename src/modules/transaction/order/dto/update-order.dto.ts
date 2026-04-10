import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class OrderDto {
  @ApiProperty()
  @IsString()
  itemName?: string;

  @ApiProperty()
  @IsString()
  color?: string;

  @ApiProperty()
  @IsString()
  size?: string;

  @ApiProperty()
  @IsNumber()
  quantity?: number;

  @ApiProperty()
  @IsNumber()
  price?: number;
}

export class DetailOrderDto {
  @ApiProperty({ type: [OrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  orders?: OrderDto[];

  @ApiProperty()
  @IsString()
  customerName?: string;

  @ApiProperty()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsNumber()
  status?: number;

  @ApiProperty()
  @IsString()
  createdAt?: string;

  @ApiProperty()
  @IsString()
  updatedAt?: string;
}
