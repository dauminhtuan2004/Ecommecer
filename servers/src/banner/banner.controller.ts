import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BannerService } from './banner.service';
import { UploadService } from '../upload/upload.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(
    private bannerService: BannerService,
    private uploadService: UploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all banners' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'List of banners' })
  findAll(@Query('active') active?: string) {
    const activeOnly = active === 'true';
    return this.bannerService.findAll(activeOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiResponse({ status: 200, description: 'Banner details' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new banner with image upload (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Summer Sale 2024' },
        subtitle: { type: 'string', example: 'Giảm giá lên đến 50%' },
        image: { type: 'string', format: 'binary', description: 'Upload ảnh từ máy' },
        video: { type: 'string', example: 'https://example.com/video.mp4' },
        link: { type: 'string', example: '/products/sale' },
        buttonText: { type: 'string', example: 'Mua ngay' },
        isActive: { type: 'boolean', example: true },
        order: { type: 'number', example: 1 }
      },
      required: ['title', 'image']
    }
  })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    // Upload ảnh lên Cloudinary
    const imageUrls = await this.uploadService.uploadImages([file]);
    
    // Tạo banner với URL ảnh từ Cloudinary
    const createBannerDto: CreateBannerDto = {
      title: body.title,
      subtitle: body.subtitle,
      image: imageUrls[0],
      video: body.video,
      link: body.link,
      buttonText: body.buttonText || 'Mua ngay',
      isActive: body.isActive === 'true' || body.isActive === true,
      order: body.order ? parseInt(body.order) : 0
    };
    
    return this.bannerService.create(createBannerDto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload banner image (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const urls = await this.uploadService.uploadImages([file]);
    return { url: urls[0] };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update banner with optional image upload (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Summer Sale 2024' },
        subtitle: { type: 'string', example: 'Giảm giá lên đến 50%' },
        image: { type: 'string', format: 'binary', description: 'Upload ảnh mới (optional)' },
        video: { type: 'string', example: 'https://example.com/video.mp4' },
        link: { type: 'string', example: '/products/sale' },
        buttonText: { type: 'string', example: 'Mua ngay' },
        isActive: { type: 'boolean', example: true },
        order: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const updateBannerDto: UpdateBannerDto = {
      title: body.title,
      subtitle: body.subtitle,
      video: body.video,
      link: body.link,
      buttonText: body.buttonText,
      isActive: body.isActive === 'true' || body.isActive === true,
      order: body.order ? parseInt(body.order) : undefined
    };

    // Nếu có upload ảnh mới, upload lên Cloudinary
    if (file) {
      const imageUrls = await this.uploadService.uploadImages([file]);
      updateBannerDto.image = imageUrls[0];
    }

    return this.bannerService.update(+id, updateBannerDto);
  }

  @Put(':id/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Reorder banner (Admin only)' })
  @ApiBody({ schema: { type: 'object', properties: { order: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Banner order updated' })
  reorder(@Param('id') id: string, @Body('order') order: number) {
    return this.bannerService.reorder(+id, order);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Delete banner (Admin only)' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
