import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor (
		@Inject(MemberService)	private readonly memberService: MemberService,
								private reflector: Reflector) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userRole = await this.memberService.getRole(request.params.roomId, request.user.userId);
		if (!userRole) { return false; }
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) { return true; }
		if (roles.includes(userRole)) { return true; }
		return false;
  	}
}
