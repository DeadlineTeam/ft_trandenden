import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthDeclinedException } from './authorize.exception';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  handleRequest(err, user, info) {
    // If an UnauthorizedException is thrown, catch it and redirect the user
    if (err || !user) {
		throw new AuthDeclinedException();
	}
    return user;
  }
}