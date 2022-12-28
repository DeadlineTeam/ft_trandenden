
import { Controller,  Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Response as Res } from 'express';
import { Request as Req } from 'express'
import { Response } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { FortyTwoAuthGuard } from './auth/42-auth.guard';
import { UseFilters } from '@nestjs/common';
import {AuthDeclinedExceptionFilter} from './auth/auth-execption.filter';



@Controller() 
export class AppController {
	constructor (private authService:AuthService,
				private usersService: UsersService) {}
  
	@UseGuards(FortyTwoAuthGuard)
  	@UseFilters(AuthDeclinedExceptionFilter)
	@Get("pong_api")
	async auth(@Request() req, @Response() res: Res) {
		// console.log("holla");
		// console.log(req.user)
		return await this.authService.login(req.user, res);
	}

	@UseGuards(JwtAuthGuard)
	@Get("getUser")
	async getUser(@Request() req: Req) {
		console.log ("get user")
		console.log (req.user)
		return (req.user)
	}
}
