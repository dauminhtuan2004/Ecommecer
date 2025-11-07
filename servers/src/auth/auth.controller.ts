import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';  // Import Swagger decorators
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';

@ApiTags('Authentication')  // Group endpoints trong docs
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })  // Summary trong docs
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })  // Schema cho body
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }
}