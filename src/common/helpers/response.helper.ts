import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import moment from 'moment';
import { EvType } from '../enums/evtype.enums';

@Injectable()
export class ResponseHelperService {
  // Nest-friendly success: returns structured object instead of writing to Express Response
  successNest(message: string, code: string, data?: any, reqId?: string, reqCode?: string) {
    const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const token = data?.Token ?? data?.SessionId ?? '';
    const expiresIn = data?.ExpiresIn ?? '';

    const response = {
      Message: message,
      TimeStamp: timeStamp,
      EvCode: code,
      EvType: EvType.Success,
      ReqId: reqId ?? '',
      ReqCode: reqCode ?? '',
      ...(expiresIn !== '' && { ExpiresIn: expiresIn }),
      ...(token !== '' && { SessionId: token }),
      ...(data && Object.keys(data).length > 0 && { Data: data }),
    };
    return response;
  }

  // Nest-friendly failure: throws given Nest exception with common body format
  failNest(ExceptionCtor: new (response?: any) => Error, message: string, code: string, reqId?: string, reqCode?: string): never {
    const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
    
    const responseBody = {
      Message: message,
      TimeStamp: timeStamp,
      EvCode: code,
      EvType: EvType.Failed,
      ReqId: reqId ?? '',
      ReqCode: reqCode ?? '',
    };

    // Throw constructed exception with standardized body
    throw new ExceptionCtor(responseBody);
  }
}