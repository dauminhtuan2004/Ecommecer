// src/payment/payment.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth('Authorization')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment for order' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment created' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Put(':id/status')
  @Roles('ADMIN')  // Chỉ admin update status
  @ApiOperation({ summary: 'Update payment status (Admin only)' })
  @ApiBody({ type: UpdatePaymentStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdatePaymentStatusDto) {
    return this.paymentService.updateStatus(+id, updateStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user payments (with filters)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] })
  @ApiQuery({ name: 'method', required: false, enum: ['CASH', 'CARD', 'VNPAY', 'MOMO'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of payments' })
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentService.findAll(query);
  }
}