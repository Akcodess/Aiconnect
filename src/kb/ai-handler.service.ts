import { Injectable } from '@nestjs/common';

import { AiUtilService } from '../common/utils/ai.util';
import { LoggingService } from '../common/utils/logging.util';
import type { KbInitResult, KbInitDispatchOptions, KbHandlerCreds, KbHandlerOps } from './types/kb.types';
import { kbResponseMessages } from './constants/kb.constants';

@Injectable()
export class KbAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly aiUtil: AiUtilService) { }

  // Nested mapping per platform with operation keys (e.g., KbInit)
  private readonly handlers: Record<string, KbHandlerOps> = {
    openai: { KbInit: this.handleOpenAI.bind(this) }
  };

  async dispatch(options: KbInitDispatchOptions): Promise<KbInitResult | null> {
    const { platform, creds } = options;
    const key = platform?.toLowerCase();
    const fn = this.handlers[key]?.KbInit;
    return fn ? fn(platform, creds) : null;
  }

  private async handleOpenAI(platform: string, creds: KbHandlerCreds): Promise<KbInitResult | null> {
    try {
      const result = await this.aiUtil?.kbInitOpenAI({ APIKey: creds?.APIKey!, XPlatformID: platform });
      return result as KbInitResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages?.kbInitFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}