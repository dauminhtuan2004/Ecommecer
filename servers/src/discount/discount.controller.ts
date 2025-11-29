import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';
import { ValidateDiscountDto } from './dto/validate-discount.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Discounts')
@ApiBearerAuth('Authorization')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tạo mã giảm giá mới (Admin only)' })
  @ApiResponse({ status: 201, description: 'Mã giảm giá đã được tạo' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách mã giảm giá' })
  @ApiResponse({ status: 200, description: 'Danh sách mã giảm giá' })
  findAll(@Query() query: QueryDiscountDto) {
    return this.discountService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lấy thống kê mã giảm giá (Admin only)' })
  @ApiResponse({ status: 200, description: 'Thống kê mã giảm giá' })
  getStats() {
    return this.discountService.getStats();
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validate mã giảm giá' })
  @ApiResponse({ status: 200, description: 'Kết quả validate' })
  @ApiResponse({ status: 400, description: 'Mã giảm giá không hợp lệ' })
  validate(@Body() validateDto: ValidateDiscountDto) {
    return this.discountService.validateDiscount(validateDto.code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết mã giảm giá' })
  @ApiResponse({ status: 200, description: 'Chi tiết mã giảm giá' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cập nhật mã giảm giá (Admin only)' })
  @ApiResponse({ status: 200, description: 'Mã giảm giá đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa mã giảm giá (Admin only)' })
  @ApiResponse({ status: 200, description: 'Mã giảm giá đã được xóa' })
  @ApiResponse({ status: 400, description: 'Không thể xóa mã đang được sử dụng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
