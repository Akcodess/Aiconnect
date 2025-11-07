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

    // Resolve message: prefer standardized body fields, then fall back to validation defaults
    let message: string = validationFailedMessage;
    if (typeof exceptionRes?.Message === 'string' && exceptionRes.Message.trim() !== '') {
      message = exceptionRes.Message;
    } else if (Array.isArray(exceptionRes?.message) && exceptionRes.message.length > 0) {
      message = String(exceptionRes.message[0]);
    } else if (typeof exceptionRes === 'string') {
      message = exceptionRes;
    } else if (typeof exceptionRes?.message === 'string') {
      message = exceptionRes.message;
    }

    // Resolve EvCode: prefer standardized body field if present, else map based on status
    let evCode: string = typeof exceptionRes?.EvCode === 'string' && exceptionRes.EvCode.trim() !== ''
      ? exceptionRes.EvCode
      : sessionResponseCodes.SessionInitFailed;
    if (evCode === sessionResponseCodes.SessionInitFailed) {
      if (status === 401) {
        evCode = sessionResponseCodes.Unauthorized;
      } else if (status === 403) {
        evCode = sessionResponseCodes.MissingToken;
      } else if (status >= 500) {
        evCode = sessionResponseCodes.SessionInitFailed;
      }
    }

    const payload = {
      Message: message,
      TimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      EvCode: evCode,
      EvType: exceptionRes?.EvType ?? EvType.Failed,
      ...(typeof exceptionRes?.ReqId === 'string' && { ReqId: exceptionRes.ReqId }),
      ...(typeof exceptionRes?.ReqCode === 'string' && { ReqCode: exceptionRes.ReqCode }),
    };

    response.status(status).json(payload);
  }
}