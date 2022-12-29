import { Controller, Request, Delete, Get, Body, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MemberService } from './member.service';
import { Roles } from 'src/member/role-guard/roles.decorator';
import { RolesGuard } from 'src/member/role-guard/roles.guard';
import { ExistanceGuard } from './existance-guard/existance.guard';

@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@UseGuards(RolesGuard)
	@Roles('OWNER')
	@Post('/:roomId/:userId/add')
	addMember(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.addMember(roomId, userId);
	}

	
	@UseGuards(ExistanceGuard)
	@UseGuards(RolesGuard)
	@Get('/:roomId/:userId/get')
	getMember(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.getMember(roomId, userId);
	}

	@UseGuards(ExistanceGuard)
	@UseGuards (RolesGuard)
	@Roles('OWNER', 'ADMIN')
	@Delete ('/:roomId/:userId/delete')
	deleteMember(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.deleteMember(roomId, userId);
	}

	@UseGuards(ExistanceGuard)
	@UseGuards(RolesGuard)
	@Get('/:roomId/:userId/role')
	getRole(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.getRole(roomId, userId);
	}

	@UseGuards(RolesGuard)
	@Get ('/:roomId/all')
	getAllMembers(@Param('roomId') roomId: number) {
		return this.memberService.getAllMembers(roomId);
	}


	@UseGuards(RolesGuard)
	@Get ('/:roomId/owner')
	getOwner(@Param('roomId') roomId: number) {
		return this.memberService.getOwner(roomId);
	}

	@UseGuards(ExistanceGuard)
	@UseGuards(RolesGuard)
	@Roles('OWNER')
	@Post ('/:roomId/:userId/updateRole')
	updateRole(@Param('roomId') roomId: number, @Param('userId') userId: number, @Body('role') role: string) {
		return this.memberService.updateRole(roomId, userId, role);
	}

	@UseGuards(ExistanceGuard)
	@UseGuards(RolesGuard)
	@Roles('OWNER', 'ADMIN')
	@Post('/:roomId/:userId/mute')
	muteUser(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.muteUser(roomId, userId);
	}

	@UseGuards(RolesGuard)
	@Roles('OWNER', 'ADMIN')
	@Post ('/:roomId/:userId/unmute')
	unmuteUser(@Param('roomId') roomId: number, @Param('userId') userId: number) {
		return this.memberService.unmuteUser(roomId, userId);
	}
}
