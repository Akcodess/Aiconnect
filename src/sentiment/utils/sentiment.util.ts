import { Injectable } from '@nestjs/common';

import { ValkeyConfigService } from '../../valkey/valkey.service';
import { LoggingService } from '../../common/utils/logging.util';

@Injectable()
export class SentimentUtilityService {

  constructor(private valkey: ValkeyConfigService, private logger: LoggingService) { }

  getSentimentLabel(score: number | null): string {
    if (score === null || score === undefined) return 'Neutral';

    if (score <= -0.5) return 'Strongly Negative';
    if (score > -0.5 && score <= -0.1) return 'Slightly Negative';
    if (score > -0.1 && score < 0.1) return 'Neutral';
    if (score >= 0.1 && score < 0.5) return 'Slightly Positive';
    if (score >= 0.5) return 'Strongly Positive';
    return 'Neutral';
  }

  async calculateAverageScore(dbName: 'sentiment' | 'sentimentTextChat', processCode: string, uxid: string, tenantCode: string): Promise<number> {
    try {
      // Map DB name to DB number
      const dbMap: { [key: string]: number } = { sentiment: 0, sentimentTextChat: 5 };
      const dbNumber = dbMap[dbName];
      if (dbNumber === undefined) return 0;

      await this.valkey.SwitchToDatabase(dbNumber);

      // Pattern: service:processCode:*:*:tenantCode
      // We later filter entries by UXID from the JSON value to avoid having to hash UXID
      const keyPattern = `${dbName}:${processCode}:*:*:${tenantCode}`;
      const keys = await this.valkey.ListKeys(keyPattern);
      let totalScore = 0;
      let count = 0;

      for (const key of keys) {
        let cached: string | null = null;
        if (dbName === 'sentiment') {
          cached = await this.valkey.GetSentiment(key);
        } else if (dbName === 'sentimentTextChat') {
          cached = await this.valkey.GetSentimentTextChat(key);
        }

        if (cached) {
          try {
            const entry = JSON.parse(cached);

            // Ensure the entry belongs to the requested UXID
            if (entry?.UXID !== uxid) continue;
            let score = 0;
            // For sentiment DB, OverallScore is at entry.Response.OverallScore
            if (dbName === 'sentiment' && entry?.Response?.OverallScore !== undefined && typeof entry.Response.OverallScore === 'number') {
              score = entry.Response.OverallScore;
              count++;
              totalScore += score;
            }
            // For sentimentTextChat DB, OverallScore is inside each object in entry.Response.Sentiment
            else if (
              dbName === 'sentimentTextChat' && entry?.Response?.Sentiment && typeof entry.Response.Sentiment === 'object') {
              const sentimentObj = entry.Response.Sentiment;
              for (const k in sentimentObj) {
                if (sentimentObj[k]?.OverallScore !== undefined && typeof sentimentObj[k].OverallScore === 'number') {
                  score = sentimentObj[k].OverallScore;
                  count++;
                  totalScore += score;
                }
              }
            }
          } catch (err) {
            this.logger.error(err);
          }
        }
      }
      return count > 0 ? totalScore / count : 0;
    } catch (error) {
      this.logger.error(error);
      return 0;
    }
  }
}