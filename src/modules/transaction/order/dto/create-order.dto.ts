import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CreateOrderDetails {
  @ApiProperty()
  @IsUUID()
  idItemVariant: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  ammount: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  @IsUUID()
  customer: string;

  @ApiProperty({ type: [CreateOrderDetails] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetails)
  orderDetails: CreateOrderDetails[];
}

export class SelectOption {
  label: string;
  value: string;
}
