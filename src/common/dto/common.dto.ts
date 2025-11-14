import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptRequestDto {
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Payload to be encrypted. Can be any JSON-serializable object or primitive.',
    example: { userId: '12345', token: 'abcxyz', meta: { scope: 'read' } },
    required: true,
  })
  Data: any;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: 'Optional request identifier for tracing.',
    example: 'req-123',
    required: false,
  })
  ReqId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: 'Optional request code for tracing or correlation.',
    example: 'code-456',
    required: false,
  })
  ReqCode?: string;
}