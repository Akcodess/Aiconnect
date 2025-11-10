import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('TextToSpeechAudioUtil');

export function bufferAudioSync(result: any): string {

  const uploadDir = path.join(__dirname, process.env.FILEUPLODA_PATH!);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `tts-${Date.now()}.${process.env.AUDIO_EXT}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, result as any, 'binary');

  logger.log(`Audio saved to ${filePath}`);
  return `${process.env.ACCESS_FILEUPLODA_PATH}/${fileName}`;
}

export async function bufferAudio(result: string | Uint8Array | null): Promise<string> {
  return bufferAudioSync(result);
}