
import { Controller,  Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Response as Res } from 'express';
import { Response } from '@nestjs/common';
@Controller() 
export class AppController {
	constructor(private authService: AuthService) {}
  
	@UseGuards(AuthGuard('42'))
  	@Get("pong_api")
	async auth(@Request() req, @Response() res: Res) {
		// console.log("holla");
		console.log(req.user)
		return await this.authService.login(req.user, res);
	}

	@UseGuards(JwtAuthGuard)
	test(@Request() req) {
		return req.user;
	}
}
