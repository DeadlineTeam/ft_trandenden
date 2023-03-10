import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
// 	canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
// 		// const response = context.switchToHttp().getResponse();
// 		// // console.log (response.)
// 		// response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
// 		return super.canActivate(context);
// 	}
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	async canActivate(context: ExecutionContext,): Promise<boolean> {
		const response = context.switchToHttp().getResponse();
		response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
		const parentCanActivate = (await super.canActivate(context)) as boolean;
		return parentCanActivate;
	}
}