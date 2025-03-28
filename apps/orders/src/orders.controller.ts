import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(): Promise<OrderDto[]> {
    return this.ordersService.getOrders();
  }

  @Post()
  createOrder(@Body() data: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.createOrder(data);
  }
}
