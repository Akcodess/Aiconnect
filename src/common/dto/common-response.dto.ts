import { ApiProperty } from '@nestjs/swagger';

// Health response is a simple object (not using the common envelope helper)
export class HealthResponseDto {
  @ApiProperty({ description: 'Health status text', example: 'OK' })
  Text: string;

  @ApiProperty({ description: 'HTTP status code for health check', example: 200 })
  Status: number;
}

// Version response: wrapped in standard envelope with Data.Version fields
export class VersionDto {
  @ApiProperty({ description: 'Release version identifier', example: '1.0.0' })
  ReleaseVersion: string;

  @ApiProperty({ description: 'Release date (YYYY-MM-DD)', example: '2025-01-01' })
  ReleaseDate: string;

  @ApiProperty({ description: 'Product or build name', example: 'AIConnect' })
  Name: string;
}

export class VersionDataDto {
  @ApiProperty({ description: 'Version information object', type: VersionDto })
  Version: VersionDto;
}

export class VersionResponseEnvelopeDto {
  @ApiProperty({ description: 'Event message', example: 'Version fetched successfully' })
  Message: string;

  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: '2025-01-01 12:00:00' })
  TimeStamp: string;

  @ApiProperty({ description: 'Event code', example: 'VersionInfoFetch' })
  EvCode: string;

  @ApiProperty({ description: 'Event type', example: 'Success' })
  EvType: string;

  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  ReqId?: string;

  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  ReqCode?: string;

  @ApiProperty({ description: 'Optional data payload containing version info', required: false, type: VersionDataDto })
  Data?: VersionDataDto;
}

// Encrypt response: wrapped in standard envelope with Data.EncryptData string
export class EncryptResponseDataDto {
  @ApiProperty({ description: 'Encrypted ciphertext of the input payload', example: 'eyJlbmMiOiJBMTI4R0NN...' })
  EncryptData: string;
}

export class EncryptResponseEnvelopeDto {
  @ApiProperty({ description: 'Event message', example: 'Data encrypted successfully' })
  Message: string;

  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: '2025-01-01 12:00:00' })
  TimeStamp: string;

  @ApiProperty({ description: 'Event code', example: 'EncryptSuccess' })
  EvCode: string;

  @ApiProperty({ description: 'Event type', example: 'Success' })
  EvType: string;

  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  ReqId?: string;

  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  ReqCode?: string;

  @ApiProperty({ description: 'Optional data payload containing encrypted data', required: false, type: EncryptResponseDataDto })
  Data?: EncryptResponseDataDto;
}