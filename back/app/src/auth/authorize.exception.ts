import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthDeclinedException extends HttpException {
	constructor() {
	  super('AuthDeclined', HttpStatus.UNAUTHORIZED);
	}
  }