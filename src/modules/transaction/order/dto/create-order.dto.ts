import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

class CreateOrderDetails {
  @ApiProperty()
  @IsUUID()
  idItemVariant: string;

  @ApiProperty()
  @IsNumber()
  price: string;

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
}
