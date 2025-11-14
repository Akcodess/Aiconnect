import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';
import { EvType } from '../../common/enums/evtype.enums';
import { openChatResponseCodes, openChatResponseMessages } from '../constants/openchat.constants';

export class OpenChatInitDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request identifier for tracing.', example: 'req-123' })
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request code for correlation.', example: 'code-456' })
  ReqCode!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Process code for scoping assistant/thread cache keys (optional).', example: 'proc-openchat-xyz', required: false })
  ProcessCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Contact identifier (optional) to scope OpenChat assets.', example: 'contact-789', required: false })
  ContactId?: string;
}

export class OpenChatInitResponseDto {
  @ApiProperty({ description: 'OpenAI Thread ID created or retrieved for the conversation.', example: 'thread_abc123' })
  ThreadId!: string;
  @ApiProperty({ description: 'OpenAI Assistant ID used to manage conversation context.', example: 'asst_def456' })
  AssistantId!: string;
}

export class OpenChatChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request identifier for tracing.', example: 'req-123' })
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request code for correlation.', example: 'code-456' })
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User message to send into the conversation.', example: 'Hello, can you assist me with my account?' })
  Message!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Assistant ID that manages conversation context.', example: 'asst_def456' })
  AssistantId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Thread ID for this multi-turn conversation.', example: 'thread_abc123' })
  ThreadId!: string;
}

export class OpenChatChatResponseDto {
  @ApiProperty({ description: 'Thread ID associated with this chat response.', example: 'thread_abc123' })
  ThreadId!: string;
  @ApiProperty({ description: 'Assistant ID associated with this chat response.', example: 'asst_def456' })
  AssistantId!: string;
  @ApiProperty({ description: 'Assistant reply text or structured content.', example: 'Sure, I can help with that. What’s your account number?' })
  reply?: any;
  @ApiProperty({ description: 'Full message history entries returned by the assistant.', example: [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi! How can I help?' }] })
  messages?: Array<{ role: string; content: any }>;
}

// Standardized envelope for OpenChat Initialize responses
export class OpenChatInitResponseEnvelopeDto {
  @Expose()
  @ApiProperty({ description: 'Event message', example: openChatResponseMessages?.OpenChatInitSuccess })
  @Transform(({ value }) => value ?? openChatResponseMessages?.OpenChatInitSuccess)
  Message!: string;

  @Expose()
  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: moment().format('YYYY-MM-DD HH:mm:ss') })
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @ApiProperty({ description: 'Event code', example: openChatResponseCodes?.OpenChatInitSuccess })
  @Transform(({ value }) => value ?? openChatResponseCodes?.OpenChatInitSuccess)
  EvCode!: string;

  @Expose()
  @ApiProperty({ description: 'Event type', example: EvType?.Success })
  @Transform(({ value }) => value ?? EvType?.Success)
  EvType!: EvType;

  @Expose()
  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @Expose()
  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @Expose()
  @ApiProperty({ description: 'Data payload containing assistant and thread IDs.', type: OpenChatInitResponseDto })
  @Type(() => OpenChatInitResponseDto)
  Data!: OpenChatInitResponseDto;
}

// Standardized envelope for OpenChat Chat responses
export class OpenChatChatResponseEnvelopeDto {
  @Expose()
  @ApiProperty({ description: 'Event message', example: openChatResponseMessages?.OpenChatSuccess })
  @Transform(({ value }) => value ?? openChatResponseMessages?.OpenChatSuccess)
  Message!: string;

  @Expose()
  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: moment().format('YYYY-MM-DD HH:mm:ss') })
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @ApiProperty({ description: 'Event code', example: openChatResponseCodes?.OpenChatSuccess })
  @Transform(({ value }) => value ?? openChatResponseCodes?.OpenChatSuccess)
  EvCode!: string;

  @Expose()
  @ApiProperty({ description: 'Event type', example: EvType?.Success })
  @Transform(({ value }) => value ?? EvType?.Success)
  EvType!: EvType;

  @Expose()
  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @Expose()
  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @Expose()
  @ApiProperty({ description: 'Data payload containing assistant reply and message history.', type: OpenChatChatResponseDto })
  @Type(() => OpenChatChatResponseDto)
  Data!: OpenChatChatResponseDto;
}