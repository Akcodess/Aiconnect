import { Test, TestingModule } from '@nestjs/testing';
import { SentimentService } from './sentiment.service';
import { AIHandlerService } from './ai-handler.service';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TokenUtilityService } from '../common/utils/token.util';
import { SentimentUtilityService } from '../common/utils/sentiment.util';
import { ConfigService } from '@nestjs/config';

describe('SentimentService', () => {
  let service: SentimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentService,
        AIHandlerService,
        ResponseHelperService,
        LoggingService,
        TokenUtilityService,
        SentimentUtilityService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'XPLATFORMID') return 'google,aws,azure,default';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SentimentService>(SentimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
