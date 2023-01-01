import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GateWayGuard implements CanActivate {
	constructor(@Inject (AuthService) private readonly authService: AuthService) {}
	canActivate(context: ExecutionContext): boolean {
    	console.log ("hello")
		return true;
		// const client 	= context.switchToWs().getClient();
		// const payload 	= this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		// console.log ("hellollo")
		// console.log (payload);
		// if (!payload) {
		// 	client.disconnect ();
		// 	return false;
		// }
		// return true;
  }
}