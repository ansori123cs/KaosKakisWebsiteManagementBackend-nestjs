import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
@ApiTags('Transaction - Order')
@Controller('/transaction/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @ApiOkResponse()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.orderService.findAll(limit, offset);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: CreateOrderDto,
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
