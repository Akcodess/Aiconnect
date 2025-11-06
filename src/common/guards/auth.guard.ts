import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ResponseCodes, ResponseMessages } from '../../session/enums/session-response.enums';

interface CustomJwtPayload {
  platform?: string;
  services?: string;
  user?: string;
  tenant?: string;
  iat?: number;
  exp?: number;
}

interface CustomJwtRequest extends Request {
  XPlatformID?: string;
  XPlatformSID?: string;
  XPlatformUA?: any;
  TenantCode?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomJwtRequest>();
    const token = request.headers['sessionid'] as string;

    if (!token) {
      throw new ForbiddenException({
        code: ResponseCodes.MissingToken,
        message: ResponseMessages.MissingToken,
      });
    }

    if (this.isTokenExpired(token)) {
      throw new UnauthorizedException({
        code: ResponseCodes.TokenInvalid,
        message: ResponseMessages.TokenInvalid,
      });
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException({
        code: ResponseCodes.JwtSecretMissing,
        message: ResponseMessages.JwtSecret,
      });
    }

    try {
      const decoded = jwt.verify(token, secret) as CustomJwtPayload;
      
      request.XPlatformID = decoded.platform ?? '';
      request.XPlatformSID = decoded.services ?? '';
      request.XPlatformUA = decoded.user ? JSON.parse(decoded.user) : {};
      request.TenantCode = decoded.tenant ?? '';

      const allowedPlatforms = this.configService.get<string>('XPLATFORMID');
      if (!allowedPlatforms?.includes(decoded.platform || '')) {
        throw new UnauthorizedException({
          code: ResponseCodes.XPlatformIdMismatch,
          message: ResponseMessages.IdMismatch,
        });
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        code: ResponseCodes.Unauthorized,
        message: ResponseMessages.Unauthorized,
      });
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }
}