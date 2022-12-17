import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor (
	private authService: AuthService,
	private readonly ConfigService: ConfigService
	) 
  {
    super({
		clientID: ConfigService.get('CLIENTID'),
		clientSecret: ConfigService.get('CLIENTSECRET'),
		callbackURL: ConfigService.get('CALLBACKURL'),
	});
  }

  async validate(accessToken, refreshToken, profile, c): Promise<any> {
    const user = await this.authService.validateUser(profile);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}