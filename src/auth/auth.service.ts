import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/models/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async generateJwtToken(user: any): Promise<string> {
    const payload = { sub: user._id, email: user.email };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_MODULE_SECRET', 'secret'),
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    isTwoFactorAuthenticationEnabled: boolean;
  }> {
    const user = await this.validateUser(email, password);
    const accessToken = await this.generateJwtToken(user);
    return {
      accessToken,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
    };
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
