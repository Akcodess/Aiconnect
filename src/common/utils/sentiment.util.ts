import { Injectable } from '@nestjs/common';

@Injectable()
export class SentimentUtilityService {
  getSentimentLabel(score: number): string {
    if (score >= 0.7) return 'Very Positive';
    if (score >= 0.3) return 'Positive';
    if (score >= -0.3) return 'Neutral';
    if (score >= -0.7) return 'Negative';
    return 'Very Negative';
  }

  async calculateAverageScore(
    type: string,
    processCode: string,
    uxid: string,
    tenantCode: string
  ): Promise<number> {
    // Placeholder for actual average score calculation
    // This would typically query a database or cache
    return 0.5;
  }
}