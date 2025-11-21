import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Query,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common'; // Fix: Import UseGuards
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard cho Google
import { Req } from '@nestjs/common'; // Fix: Import Req decorator
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt'; // Fix: Import JwtService để sign token
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService, // Fix: Inject JwtService cho token sign
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  @ApiResponse({ status: 400, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password/:token')
  @ApiOperation({ summary: 'Reset password form (GET for link)' })
  @ApiParam({ name: 'token', description: 'Reset token from email' })
  @ApiQuery({ name: 'email', description: 'Email user', required: true })
  resetPasswordForm(
    @Param('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    res.send(`
    <html>
      <body>
        <h2>Reset Password</h2>
        <form action="/api/auth/reset-password/${token}" method="POST">
          <input type="hidden" name="email" value="${email}" />
          <input type="password" name="password" placeholder="New password" required minlength="6" />
          <button type="submit">Reset</button>
        </form>
      </body>
    </html>
  `);
  }

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiParam({ name: 'token', description: 'Reset token from email' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    // SỬA: Truyền password thay vì cả DTO
    return this.authService.resetPassword(
      token,
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 302, description: 'Redirect to Google' })
  googleAuth() {}

  @Get('google-login/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Google login successful, return token',
  })
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const payload = { sub: user.userId, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    res.json({ access_token: token, user });
  }
}
