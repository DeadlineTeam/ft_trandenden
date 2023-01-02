import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {UnauthorizedException} from '@nestjs/common';

const getAuthCookie = (req) => {
	  if (req && req.cookies) {
		if (req.cookies['Authorization'] != null)
		{
			return req.cookies['Authorization'].split(' ')[1];
		}
	  }
	  return null;
	}	

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: getAuthCookie,
      ignoreExpiration: true,
      secretOrKey: "HelloWorld",
    });
  }

  async validate(payload: any) {
	console.log("playload == ", payload);
	if (payload == null)
		throw new UnauthorizedException();
	const username = (await this.usersService.findById(payload.sub)).username;
	if (username == null)
		throw new UnauthorizedException();
    return { userId: payload.sub, isTauth: payload.isTwoFactorAuthenticated, username: username };
  }
}