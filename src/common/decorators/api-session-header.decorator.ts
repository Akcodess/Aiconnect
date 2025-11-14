import { ApiHeader } from '@nestjs/swagger';

export function ApiSessionHeader(options?: { description?: string; required?: boolean; name?: string }) {
  const { description = 'Session ID token', required = true, name = 'sessionid' } = options ?? {};
  return ApiHeader({ name, description, required });
}