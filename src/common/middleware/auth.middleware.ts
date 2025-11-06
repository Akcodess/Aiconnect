import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ResponseCodes, ResponseMessages } from '../../auth/enums/auth-response.enums';

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
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: CustomJwtRequest, res: Response, next: NextFunction) {
    const token = req.headers['sessionid'] as string;

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
      
      req.XPlatformID = decoded.platform ?? '';
      req.XPlatformSID = decoded.services ?? '';
      req.XPlatformUA = decoded.user ? JSON.parse(decoded.user) : {};
      req.TenantCode = decoded.tenant ?? '';

      const allowedPlatforms = this.configService.get<string>('XPLATFORMID');
      if (!allowedPlatforms?.includes(decoded.platform || '')) {
        throw new UnauthorizedException({
          code: ResponseCodes.XPlatformIdMismatch,
          message: ResponseMessages.IdMismatch,
        });
      }

      next();
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