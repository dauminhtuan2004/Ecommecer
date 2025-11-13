import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request,Query } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Request() req, @Body() body: CreateOrderDto) {
    return this.orderService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryOrderDto) {
    return this.orderService.findAll(req.user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Post(':id/discount')
  applyDiscount(@Param('id') id: string, @Body() body: ApplyDiscountDto) {
    return this.orderService.applyDiscount(+id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Body() body: DeleteOrderDto) {
    if (!body.confirm) throw new Error('Confirm deletion');
    return this.orderService.remove(+id);
  }
}