import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class EncryptRequestDto {
  @Expose()
  @IsNotEmpty()
  Data: any;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqCode?: string;
}