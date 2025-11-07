import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';
import * as path from 'path';

import { TokenPayload, TokenResult, JwtPayload } from '../types/token.types';

@Injectable()
export class TokenUtilityService {
  private readonly secret: string;
  private readonly expiredTokensPath: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
    this.expiredTokensPath = path.join(__dirname, 'expired-tokens.json');
    if (!fs.existsSync(this.expiredTokensPath)) {
      fs.writeFileSync(this.expiredTokensPath, JSON.stringify([]));
    }
  }

  IsTokenExpired(token: string): boolean {
    const tokens = this.ReadExpiredTokens();
    return tokens.includes(token);
  }

  EncryptData(plainText: string): string {
    const key = process.env.AES_CHIPER_KEY;
    if (!key) {
      throw new Error("AES_CHIPER_KEY not defined in environment");
    }

    const ciphertext = CryptoJS.AES.encrypt(plainText, key).toString();
    console.log(ciphertext);
    return ciphertext;
  };

  VerifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded || null;
    } catch (err) {
      return null;
    }
  }

  ReadExpiredTokens(): string[] {
    try {
      const raw = fs.readFileSync(this.expiredTokensPath, 'utf-8');
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  WriteExpiredTokens(tokens: string[]): void {
    try {
      fs.writeFileSync(this.expiredTokensPath, JSON.stringify(tokens, null, 2));
    } catch (err) {
      console.error('Error writing expired tokens:', err);
    }
  }

  AddExpiredToken(token: string): void {
    const tokens = this.ReadExpiredTokens();
    if (!tokens.includes(token)) {
      tokens.push(token);
      this.WriteExpiredTokens(tokens);
    }
  }

  DecryptData(ciphertext: string): string {
    const key = process.env.AES_CHIPER_KEY;
    if (!key) {
      throw new Error("AES_CHIPER_KEY not defined in environment");
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };


  async GenerateToken(payload: TokenPayload): Promise<TokenResult | null> {
    try {
      const secret = this.secret;
      if (!secret) {
        throw new Error("JWT_SECRET not defined in environment");
      }

      const token = await Promise.resolve(jwt.sign(payload, secret, { expiresIn: "24h" }));
      const decoded = jwt.decode(token) as JwtPayload | null;
      const expTime = decoded?.exp ?? 0;

      return { token, expTime };
    } catch (error: any) {
      console.error("Error generating token:", error?.message || error);
      return null;
    }
  };
}