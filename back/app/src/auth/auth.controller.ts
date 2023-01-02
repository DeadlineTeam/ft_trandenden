import { Controller,  Request, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response as Res } from 'express';
import { Request as Req } from 'express'	
import { Response } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FortyTwoAuthGuard } from './42-auth.guard';
import { UseFilters } from '@nestjs/common';
import {AuthDeclinedExceptionFilter} from './auth-execption.filter';
import { TwofaService } from './2fa.service';
import { Update2faDto } from "src/users/dto/update2fa.dto";
import { UnauthorizedException } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";


@Controller()
export class AuthController {
	constructor (private authService:AuthService,
				private usersService: UsersService,
				private twofaService: TwofaService,
				private configService: ConfigService
				) {}

	@UseGuards(FortyTwoAuthGuard)
  	@UseFilters(AuthDeclinedExceptionFilter)
	@Get("pong_api")
	async auth(@Request() req, @Response() res: Res) {
		console.log("holla");
		console.log(req.user)
		const redirect_url = await this.authService.signIn(req.user, res);
		res.redirect(redirect_url);
	}

	@Get("2fa/generate")
	@UseGuards(JwtAuthGuard)
	async register(@Request() req, @Response() res: Res) {
		const otpauthUrl  = await this.twofaService.generateSecret(req.user.userId, req.user.username);
		return this.twofaService.pipeqrcode(res, otpauthUrl);
	}

	@Post("2fa/turn-on")
	@UseGuards(JwtAuthGuard)
	async turnOnTa(@Request() req, @Body() tfaCode: Update2faDto) {
		console.log("controller", tfaCode);
		const isVerified = await this.twofaService.verifyToken(req.user.username, tfaCode.twofasecret);
		console.log(isVerified)
		if (!isVerified)
			throw new UnauthorizedException('Wrong authentication code');
		await this.usersService.turnOnTwofa(req.user.userId);
	}

	@Post('2fa/authenticate')
	async authenticate(@Request() req: Req,@Response() res: Res, @Body() tfaCode: Update2faDto)
	{
		if (req.cookies['TfaCookie'] == null)
			throw new UnauthorizedException('invalid cookieee');
		const username = await this.twofaService.verifyTwoFaKey(req.cookies['TfaCookie'].split(' ')[1]);
		if (username == null)
			throw new UnauthorizedException('invalid cccookie');
		const isVerified = await this.twofaService.verifyToken(username, tfaCode.twofasecret);
		if (!isVerified)
			throw new UnauthorizedException('user Not foud Or Wrong authentication code');
		const user = this.usersService.findByuername(username);
		const cookie = await this.authService.login(user, true);
		res.clearCookie('TfaCookie');
		res.cookie('Authorization', 'Bearer ' + cookie, {httpOnly: true}).redirect(this.configService.get('FRONTENDURL'));
	}

	@Get('2fa/turn-off')
	@UseGuards(JwtAuthGuard)
	async turnOffTa(@Request() req) {
		await this.usersService.turnOffTwofa(req.user.userId);
	}

	// check if the user is set to login using 2fa code
	@Get('2fa/')
	async check2fa(@Request() req: Req) {
		if (req.cookies['TfaCookie'] == null)
			throw new UnauthorizedException('invalid cookieee');
		// ok response
		return {status: 200};
	}
}
