export interface TokenPayload {
  [key: string]: any;
}

export interface TokenResult {
  token: string;
  expTime: number;
}

export interface JwtPayload {
  exp?: number;
  [key: string]: any;
}