import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { sessionResponseCodes, sessionResponseMessages } from '../../session/constants/session.constants';

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
        code: sessionResponseCodes.MissingToken,
        message: sessionResponseMessages.MissingToken,
      });
    }

    if (this.isTokenExpired(token)) {
      throw new UnauthorizedException({
        code: sessionResponseCodes.TokenInvalid,
        message: sessionResponseMessages.TokenInvalid,
      });
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException({
        code: sessionResponseCodes.JwtSecretMissing,
        message: sessionResponseMessages.JwtSecret,
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
          code: sessionResponseCodes.XPlatformIdMismatch,
          message: sessionResponseMessages.IdMismatch,
        });
      }

      next();
    } catch (error) {
      throw new UnauthorizedException({
        code: sessionResponseCodes.Unauthorized,
        message: sessionResponseMessages.Unauthorized,
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