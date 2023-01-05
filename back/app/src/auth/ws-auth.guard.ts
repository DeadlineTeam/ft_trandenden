import { ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { WsException } from "@nestjs/websockets";
import { Inject } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";

@Injectable()
export class WsAuthGuardConnect implements CanActivate{
	constructor (
		@Inject(AuthService) private authService: AuthService,
		@Inject(UsersService) private userService: UsersService,
	) {}
	async canActivate (context: any): Promise<boolean>  {
		try {
			const bearerToken = context.handshake?.headers?.cookie.replace ("Authorization=Bearer%20", "")
			const decoded = this.authService.verify(bearerToken);
			const user = await this.userService.findById (Number(decoded?.sub));
			if (!user) 
				throw new WsException ("Invalid token");
			context.data = { id: user.id, username: user.username, avatar_url: user.avatar_url}
		}
		catch (e) {
			throw new HttpException ("Invalid token", 401);
		}
		return true;
	}
}

@Injectable()
export class WsAuthGuard implements CanActivate{
	constructor (
		@Inject(AuthService) private authService: AuthService,
		@Inject(UsersService) private userService: UsersService,
	) {}
	async canActivate (context: any): Promise<boolean>  {
		try {
			const bearerToken = context.args[0]?.handshake?.headers?.cookie.replace ("Authorization=Bearer%20", "")
			const decoded = this.authService.verify(bearerToken);
			const user = await this.userService.findById (Number(decoded?.sub));
			if (!user)
				return false;
		}
		catch (e) {
			return false;
		}
		return true;
	}
}




