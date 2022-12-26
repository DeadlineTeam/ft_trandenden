import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDeclinedException } from './authorize.exception';

@Catch(AuthDeclinedException)
export class AuthDeclinedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.redirect('http://localhost:3000/login?error=authDeclined');
  }
}