import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';


const getAuthCookie = (req) => {
	console.log(req.cookies, "dfdsfsdfsdfdsfds")
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
  constructor() {
    super({
      jwtFromRequest: getAuthCookie,
      ignoreExpiration: true,
      secretOrKey: "HelloWorld",
    });
  }

  async validate(payload: any) {
	console.log("playload == ", payload);
    return { userId: payload.sub, username: payload.username };
  }
}