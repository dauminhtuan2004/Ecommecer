import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { multerConfig } from './multer.config';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @ApiOperation({ summary: 'Upload multiple images to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'URLs of uploaded images' })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {  // Fix: Full type Express.Multer.File[]
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadImages(files);
    return { urls, message: 'Upload successful' };
  }
}