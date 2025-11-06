import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  info(message: string, ...args: any[]): void {
    this.logger.log(message, ...args);
  }

  error(message: string, error?: any): void {
    this.logger.error(message, error);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }
}