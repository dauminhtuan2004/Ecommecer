import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';  // Giữ tên file như code của bạn

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    // Fix: Truyền direct object vào create, không wrap 'data'
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
}