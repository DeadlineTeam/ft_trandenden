import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';


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
	const username = (await this.usersService.findById(payload.sub)).username;
    return { userId: payload.sub, isTauth: payload.isTwoFactorAuthenticated, username: username };
  }
}