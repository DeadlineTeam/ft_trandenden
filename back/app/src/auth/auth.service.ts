
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res } from 'express';
import { Response } from '@nestjs/common';
import { TwofaService } from './2fa.service';
import {ConfigService} from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
			  private jwtService: JwtService,
			  private twofaService: TwofaService,
			  private readonly configService: ConfigService,

	) {}

 async validateUser(profile: any): Promise<any> {
    var user: any = await this.usersService.findbylogin(profile.username);
    if (!user) {
        console.log("hello form the other side")
        user = await this.usersService.addUserAuth(profile);
        user.firstSignin = true;
        return user;
    }
    else
        user.firstSignin = false;
    return user;
  }

	verify (token: string) {
		try {
			return this.jwtService.verify (token , {secret: this.configService.get('JWT_SECRET')});
		}
		catch {
			return null;
		}
	}


	async login(user: any, isTfauth: boolean = false) : Promise<string>{
		const playload = {isTwoFactorAuthenticated: isTfauth, sub: user.id};
		const accessTocken = await this.jwtService.sign(playload);
		console.log(accessTocken);
		return accessTocken;
	}

	async signIn(user:any, res: Res): Promise<string>
	{
		if (user.firstSignin == true)
		{
			await res.cookie('Authorization', 'Bearer ' + (await this.login(user)), {httpOnly: true});//.redirect("http://localhost:3000/Settings");
			return this.configService.get('SETTINGSURL');
		}
		if (user.twofactor)
		{
			await res.cookie('TfaCookie', 'Bearer ' + (await this.twofaService.twoFaKey(user.username)), {httpOnly: true});//.redirect("http://localhost:3000/2fa");
			return this.configService.get('2FAURL');
		}
		await res.cookie('Authorization', 'Bearer ' + (await this.login(user)), {httpOnly: true});//.redirect("http://localhost:3000/Rooms"); // change to Home page later
		return this.configService.get('FRONTENDURL');
	}
}