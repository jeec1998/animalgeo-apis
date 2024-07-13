import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { FastifyRequestWithUser } from '../shared/types/fastify';
import { JwtPayload } from './auth.types';
import { UserService } from 'src/user/models/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_MODULE_SECRET'),
      });
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException();
      request.user = user; // Aquí estamos asegurándonos de que el objeto user se agrega correctamente al request
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
