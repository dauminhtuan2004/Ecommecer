import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('Authorization')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get revenue analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Revenue data by period' })
  getRevenue() {
    return this.dashboardService.getRevenueAnalytics();
  }

  @Get('recent-orders')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get recent orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'Recent orders list' })
  getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }

  @Get('top-products')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get top selling products (Admin only)' })
  @ApiResponse({ status: 200, description: 'Top products list' })
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }
}
