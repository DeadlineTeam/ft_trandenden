import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDeclinedException } from './authorize.exception';
import {ConfigService} from '@nestjs/config';

@Catch(AuthDeclinedException)
export class AuthDeclinedExceptionFilter implements ExceptionFilter {
	constructor(private readonly configService: ConfigService) {
	}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // response.redirect('http://localhost:3000/login?error=authDeclined');
    response.redirect(this.configService.get('LOGINURL')+ "?error=authDeclined");
  }
}