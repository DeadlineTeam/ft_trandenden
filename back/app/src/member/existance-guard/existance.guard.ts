import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberService } from 'src/member/member.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ExistanceGuard implements CanActivate {
	constructor (
		@Inject(MemberService)	private readonly memberService: MemberService,
		@Inject (PrismaService) private readonly prisma: PrismaService) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const roomId = request.params.roomId;
		const userId = request.user.userId;
		const member = await this.memberService.getMember(roomId, userId);
		return (member !== null);
  	}
}
