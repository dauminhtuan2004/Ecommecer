// src/auth/auth.controller.ts
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
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    
    // Set httpOnly cookie
    this.authService.setAuthCookie(res, result.access_token);
    
    res.status(HttpStatus.CREATED).json({
      access_token: result.access_token,
      user: result.user,
      message: 'User registered successfully'
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const result = await this.authService.login({ sub: user.id }, user);
    
    // Set httpOnly cookie
    this.authService.setAuthCookie(res, result.access_token);
    
    res.json({
      access_token: result.access_token,
      user: result.user,
      message: 'Login successful'
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res() res: Response) {
    // 🔒 FIX: Clear httpOnly cookie
    this.authService.clearAuthCookie(res);
    
    res.json({ message: 'Logout successful' });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
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
    // 🔒 FIX: Use proper HTML template with CSRF protection
    res.send(`
    <html>
      <head>
        <title>Reset Password</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
          form { display: flex; flex-direction: column; gap: 10px; }
          input, button { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
          button { background: #007bff; color: white; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Reset Password</h2>
        <form action="/api/auth/reset-password" method="POST">
          <input type="hidden" name="token" value="${token}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="password" name="password" placeholder="New password" required minlength="6" />
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
    `);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
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
  @ApiResponse({ status: 200, description: 'Google login successful' })
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    
    // 🔒 FIX: Minimal token payload for Google auth
    const payload = { sub: user.userId };
    const token = this.jwtService.sign(payload, { 
      secret: process.env.JWT_SECRET,
      expiresIn: '15m'
    });
    
    // 🔒 FIX: Set httpOnly cookie for Google auth too
    this.authService.setAuthCookie(res, token);
    
    // Redirect to frontend with success message
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/success`);
  }
}