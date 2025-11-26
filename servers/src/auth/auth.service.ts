// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ 
      email, 
      password: hashedPassword, 
      name, 
      role: 'CUSTOMER' 
    });
    const { password: _, ...result } = user;
    return this.login({ sub: result.id, email: result.email, role: result.role });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return { sub: result.id,name: result.name, email: result.email, role: result.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { sub: user.sub,name: user.name, email: user.email, role: user.role };
    return { 
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }), 
      user 
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    console.log('Forgot Password - User ID:', user.id);
    console.log('Generated token:', token);
    console.log('Expires:', expires);

    const resetData: UpdateUserResetDto = { 
      resetPasswordToken: token, 
      resetPasswordExpires: expires.toISOString()
    };

    await this.userService.updateResetToken(user.id, resetData);

    const verifyUser = await this.userService.findByEmail(email);
    if (verifyUser) {
      console.log('Verify after update - Token:', verifyUser.resetPasswordToken);
      console.log('Verify after update - Expires:', verifyUser.resetPasswordExpires);
    } else {
      console.log('ERROR: User not found after update!');
    }

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${token}?email=${email}`;
    console.log('Reset URL:', resetUrl);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - E-commerce',
      html: `<p>Click <a href="${resetUrl}">đây</a> để reset mật khẩu (expire 1 giờ).</p>`,
    });

    return { message: 'Reset email sent' };
  }

  async resetPassword(token: string, email: string, password: string): Promise<{ message: string }> {
    console.log('Reset Password Debug Start');
    console.log('Email from form:', email);
    console.log('Token from URL:', token);
    console.log('Current time:', new Date().toISOString());
    
    const user = await this.userService.findByEmail(email);
    console.log('User found:', !!user);
    
    if (user) {
      if (user.resetPasswordExpires) {
        const expiresDate = new Date(user.resetPasswordExpires);
        const now = new Date();
        console.log('Time until expiry:', expiresDate.getTime() - now.getTime(), 'ms');
        console.log('Is expired?', expiresDate < now);
      }
    }
    
    console.log('Reset Password Debug End');
    
    if (!user || 
        !user.resetPasswordToken ||
        user.resetPasswordToken !== token || 
        !user.resetPasswordExpires || 
        new Date(user.resetPasswordExpires) < new Date()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.userService.resetPassword(user.id, password);

    return { message: 'Password reset successfully' };
  }
}