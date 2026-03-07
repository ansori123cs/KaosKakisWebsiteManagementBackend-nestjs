import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateMachineDto } from './create-machine.dto';

export class UpdateMaterialDto extends PartialType(CreateMachineDto) {
  @ApiProperty()
  @IsNumber()
  status: number;
}

export class ResponseMachineDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;
}
