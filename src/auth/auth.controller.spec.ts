import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { TokenUtilityService } from '../common/utils/token.util';
import { LoggingService } from '../common/utils/logging.util';
import { ResponseHelperService } from '../common/helpers/response.helper';
import * as fs from 'fs';

jest.mock('fs');

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([{ XPUAKey: 'test-key', AIPlatform: 'google', XPUAProps: { version: '1.0', name: 'test-app' } }]));
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FORCEAIPLATFORM') {
                return 'google';
              }
              if (key === 'JWT_SECRET') {
                return 'test-secret';
              }
              return null;
            }),
          },
        },
        TokenUtilityService,
        LoggingService,
        ResponseHelperService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});