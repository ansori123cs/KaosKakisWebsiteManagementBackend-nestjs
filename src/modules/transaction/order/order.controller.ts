import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Controller, Get, Query } from '@nestjs/common';
@ApiTags('Transaction - Order')
@Controller('/transaction/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @ApiOkResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.orderService.findAll(limit, offset);
  }
}
