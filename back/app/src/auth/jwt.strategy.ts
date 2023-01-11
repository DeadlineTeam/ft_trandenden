import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

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
  constructor(private usersService: UsersService,
	private readonly configService: ConfigService) {
    super({
      jwtFromRequest: getAuthCookie,
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
	if (payload == null)
		throw new UnauthorizedException();
	const user = (await this.usersService.findById(payload.sub));
	
	if (user == null)
		throw new UnauthorizedException();
    return { userId: payload.sub, isTauth: payload.isTwoFactorAuthenticated, username: user.username };
  }
}