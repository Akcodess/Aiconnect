import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import * as crypto from 'crypto';

import { LoggingService } from '../common/utils/logging.util';
import { valkeyMessages } from './valkey.constant';

@Injectable()
export class ValkeyConfigService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggingService,
  ) {
    // Initialize Redis client using environment variables from ConfigService
    this.client = createClient({
      socket: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: Number(this.configService.get<string>('REDIS_PORT')),
      },
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('error', (err) => this.logger.error(valkeyMessages.CacheError, err));
    this.client.on('connect', () => {
      this.logger.info(`${valkeyMessages.CacheListen} ${this.configService.get<string>('REDIS_PORT')}`);
    });
    this.client.on('disconnect', () => {
      this.logger.info(valkeyMessages.CacheDisconnect);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.Connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.Disconnect();
  }

  public async Connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async Disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  // Switch to specific database for service
  public async SwitchToDatabase(dbNumber: number): Promise<void> {
    try {
      await this.client.select(dbNumber);
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  // Generate short hash key from long content
  private generateShortKey(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 12);
  }

  // Create short cache key
  public createShortKey(service: string, processCode: string, messageId: string, content: string, additionalParams?: string[]): string {
    const contentHash = this.generateShortKey(content);
    const params = additionalParams ? `:${additionalParams.join(':')}` : '';
    return `${service}:${processCode}:${messageId}:${contentHash}${params}`;
  }

  // Sentiment Analysis - Database 0
  public async SetSentiment(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(0);
    await this.Set(key, value);
  }

  public async GetSentiment(key: string): Promise<string | null> {
    await this.SwitchToDatabase(0);
    return await this.Get(key);
  }

  // Auto Disposition - Database 1
  public async SetAutoDisposition(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(1);
    await this.Set(key, value);
  }

  public async GetAutoDisposition(key: string): Promise<string | null> {
    await this.SwitchToDatabase(1);
    return await this.Get(key);
  }

  // Language Translation - Database 2
  public async SetLanguageTranslation(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(2);
    await this.Set(key, value);
  }

  public async GetLanguageTranslation(key: string): Promise<string | null> {
    await this.SwitchToDatabase(2);
    return await this.Get(key);
  }

  // Text to Speech - Database 3
  public async SetTextToSpeech(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(3);
    await this.Set(key, value);
  }

  public async GetTextToSpeech(key: string): Promise<string | null> {
    await this.SwitchToDatabase(3);
    return await this.Get(key);
  }

  // Insight - Database 4
  public async SetInsight(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(4);
    await this.Set(key, value);
  }

  public async GetInsight(key: string): Promise<string | null> {
    await this.SwitchToDatabase(4);
    return await this.Get(key);
  }

  // Sentiment Text Chat - Database 5
  public async SetSentimentTextChat(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(5);
    await this.Set(key, value);
  }

  public async GetSentimentTextChat(key: string): Promise<string | null> {
    await this.SwitchToDatabase(5);
    return await this.Get(key);
  }

  // OpenChat Assistant - Database 6
  public async SetOpenChatAssistant(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(6);
    await this.Set(key, value);
  }

  public async GetOpenChatAssistant(key: string): Promise<string | null> {
    await this.SwitchToDatabase(6);
    return await this.Get(key);
  }

  // OpenChat Thread - Database 7
  public async SetOpenChatThread(key: string, value: any): Promise<void> {
    await this.SwitchToDatabase(7);
    await this.Set(key, value);
  }

  public async GetOpenChatThread(key: string): Promise<string | null> {
    await this.SwitchToDatabase(7);
    return await this.Get(key);
  }

  // Get grouped keys by service
  public async GetGroupedKeys(): Promise<{ [key: string]: string[] }> {
    const groupedKeys: { [key: string]: string[] } = {
      sentiment: [],
      autodisposition: [],
      langtrans: [],
      tts: [],
      insight: [],
      sentimenttextchat: [],
      // OpenChat
      assistant: [],
      thread: [],
    };

    try {
      // Get sentiment keys (db 0)
      await this.SwitchToDatabase(0);
      groupedKeys.sentiment = await this.ListKeys('*');

      // Get auto disposition keys (db 1)
      await this.SwitchToDatabase(1);
      groupedKeys.autodisposition = await this.ListKeys('*');

      // Get language translation keys (db 2)
      await this.SwitchToDatabase(2);
      groupedKeys.langtrans = await this.ListKeys('*');

      // Get text to speech keys (db 3)
      await this.SwitchToDatabase(3);
      groupedKeys.tts = await this.ListKeys('*');

      // Get insight keys (db 4)
      await this.SwitchToDatabase(4);
      groupedKeys.insight = await this.ListKeys('*');

      // Get sentiment text chat keys (db 5)
      await this.SwitchToDatabase(5);
      groupedKeys.sentimenttextchat = await this.ListKeys('*');

      // Get OpenChat assistant keys (db 6)
      await this.SwitchToDatabase(6);
      groupedKeys.assistant = await this.ListKeys('*');

      // Get OpenChat thread keys (db 7)
      await this.SwitchToDatabase(7);
      groupedKeys.thread = await this.ListKeys('*');

      return groupedKeys;
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  // Flush specific service database
  public async FlushServiceDatabase(service: string): Promise<string> {
    const dbMap: { [key: string]: number } = {
      sentiment: 0,
      autodisposition: 1,
      langtrans: 2,
      tts: 3,
      insight: 4,
      sentimenttextchat: 5,
      //OpenChat
      assistant: 6,
      thread: 7,
    };

    const dbNumber = dbMap[service];
    if (dbNumber === undefined) {
      throw new Error(`Unknown service: ${service}`);
    }

    await this.SwitchToDatabase(dbNumber);
    return await this.FlushDb();
  }

  public async Set(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
      this.logger.info(valkeyMessages.CacheSet);
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async Get(key: string): Promise<string | null> {
    try {
      const result = await this.client.get(key);
      // this.logger.info(valkeyMessages.CacheHit, result ? valkeyMessages.CacheReturn : valkeyMessages.CacheNotFound);
      return result;
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async Delete(key: string): Promise<number> {
    try {
      const result = await this.client.del(key);
      this.logger.info(valkeyMessages.CacheDelete);
      return result;
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async Exists(key: string): Promise<number> {
    try {
      return await this.client.exists(key);
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async ListKeys(pattern: string = '*'): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public async FlushDb(): Promise<string> {
    try {
      const result = await this.client.flushDb();
      this.logger.info(valkeyMessages.CacheFlush);
      return result;
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  // Publish message to channel
  public async Publish(channel: string, message: string): Promise<number> {
    try {
      const subscribers = await this.client.publish(channel, message);
      this.logger.info(`Message published to ${channel}. Subscribers: ${subscribers}`);
      return subscribers;
    } catch (error) {
      this.logger.error(valkeyMessages.CacheError, error);
      throw error;
    }
  }
}