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