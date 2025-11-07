import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { sessionResponseCodes, sessionResponseMessages } from '../../session/constants/session.constants';
import { TokenUtilityService } from '../utils/token.util';
import { CustomJwtRequest } from '../types/request.types';

interface CustomJwtPayload {
  platform?: string;
  services?: string;
  user?: string;
  tenant?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService, private tokenUtilityService: TokenUtilityService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomJwtRequest>();
    const token = request.headers['sessionid'] as string;

    if (!token) {
      throw new ForbiddenException({
        code: sessionResponseCodes.MissingToken,
        message: sessionResponseMessages.MissingToken,
      });
    }

    if (this.tokenUtilityService?.IsTokenExpired(token)) {
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

      request.XPlatformID = decoded.platform ?? '';
      request.XPlatformSID = decoded.services ?? '';
      request.XPlatformUA = decoded.user ? JSON.parse(decoded.user) : {};
      request.TenantCode = decoded.tenant ?? '';

      const allowedPlatforms = this.configService.get<string>('XPLATFORMID');
      if (!allowedPlatforms?.includes(decoded.platform || '')) {
        throw new UnauthorizedException({
          code: sessionResponseCodes.XPlatformIdMismatch,
          message: sessionResponseMessages.IdMismatch,
        });
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        code: sessionResponseCodes.Unauthorized,
        message: sessionResponseMessages.Unauthorized,
      });
    }
  }
}