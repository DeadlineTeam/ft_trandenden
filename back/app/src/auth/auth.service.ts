
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res } from 'express';
import { Response } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
			  private jwtService: JwtService
	) {}

 async validateUser(profile: any): Promise<any> {
    var user: any = await this.usersService.findbylogin(profile);
    if (!user) {
        console.log("hello form the other side")
        user = await this.usersService.addUserAuth(profile);
        user.firstSignin = true;
        return user;
    }
    else
        user.firstSignin = false;
    // console.log("testtt");
    return user;
  }

	verify (token: string) {
		try {
			return this.jwtService.verify (token , {secret: "HelloWorld"});
		}
		catch {
			return null;
		}
	}

  async login(user: any, @Response() res: Res) {
    const playload = { username: user.login, sub: user.id};
    const accessTocken = this.jwtService.sign(playload);
	console.log(accessTocken);
    if (user.firstSignin == true)
        res.cookie('Authorization', 'Bearer ' + accessTocken, {httpOnly: true}).redirect("http://localhost:3000/Settings");
    else
        res.cookie('Authorization', 'Bearer ' + accessTocken, {httpOnly: true}).redirect("http://localhost:3000/Rooms");
    }
}