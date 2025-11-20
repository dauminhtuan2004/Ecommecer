import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UpdateUserResetDto } from '../user/dto/user-reset.dto';  // Import DTO mới (path từ auth/dto)

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
      return { sub: result.id, email: result.email, role: result.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { sub: user.sub, email: user.email, role: user.role };
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
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();  // Fix: toISOString() để string ISO

    const resetData: UpdateUserResetDto = { 
      resetPasswordToken: token, 
      resetPasswordExpires: expires  // Fix: string ISO
    };
    await this.userService.update(user.id, resetData);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - E-commerce',
      text: `Click link để reset: http://localhost:5000/auth/reset-password/${token}?email=${email}`,
      html: `<p>Click <a href="http://localhost:5000/auth/reset-password/${token}?email=${email}">đây</a> để reset mật khẩu (expire 1 giờ).</p>`,
    });

    return { message: 'Reset email sent' };
  }

  async resetPassword(token: string, email: string, resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { password } = resetPasswordDto;
    const user = await this.userService.findByEmail(email);
    if (!user || user.resetPasswordToken !== token || !user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {  // Fix: new Date() cho string compare
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const resetData: UpdateUserResetDto = { 
      password: hashedPassword, 
      resetPasswordToken: null,  // Fix: null OK với optional union
      resetPasswordExpires: null  // Fix: null OK với optional union
    };
    await this.userService.update(user.id, resetData);

    return { message: 'Password reset successfully' };
  }
}