import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class OpenChatInitDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsOptional()
  @IsString()
  ProcessCode?: string;

  @IsOptional()
  @IsString()
  ContactId?: string;
}

export class OpenChatInitResponseDto {
  ThreadId!: string;
  AssistantId!: string;
}

export class OpenChatChatDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  Message!: string;

  @IsString()
  @IsNotEmpty()
  AssistantId!: string;

  @IsString()
  @IsNotEmpty()
  ThreadId!: string;
}

export class OpenChatChatResponseDto {
  ThreadId!: string;
  AssistantId!: string;
  reply?: any;
  messages?: Array<{ role: string; content: any }>;
}