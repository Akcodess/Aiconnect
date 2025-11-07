import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import moment from 'moment';
import { Response, Request } from 'express';

import { sessionResponseCodes } from '../../session/constants/session.constants';
import { validationFailedMessage } from '../constants/common.constants';
import { EvType } from '../enums/evtype.enums';

@Catch(HttpException)
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { body?: any }>();

    const status = exception.getStatus();
    const exceptionRes: any = exception.getResponse();

    // Resolve message: if validation error (array), pick first; else use string or default
    let message: string = validationFailedMessage;
    if (Array.isArray(exceptionRes?.message) && exceptionRes.message.length > 0) {
      message = String(exceptionRes.message[0]);
    } else if (typeof exceptionRes === 'string') {
      message = exceptionRes;
    } else if (typeof exceptionRes?.message === 'string') {
      message = exceptionRes.message;
    }

    // Map EvCode based on status; default to SessionInitFailed for 400
    let evCode: string = sessionResponseCodes.SessionInitFailed;
    if (status === 401) {
      evCode = sessionResponseCodes.Unauthorized;
    } else if (status === 403) {
      evCode = sessionResponseCodes.MissingToken;
    } else if (status >= 500) {
      evCode = sessionResponseCodes.SessionInitFailed;
    }

    const payload = {
      Message: message,
      TimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      EvCode: evCode,
      EvType: EvType.Failed,
    };

    response.status(status).json(payload);
  }
}