import { Controller, Req, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	async create(@Req () request, @Body() createRoomDto: CreateRoomDto) {
		return this.roomService.create(createRoomDto, request.user.userId);
	}

	@Get('all')
	async findAll(@Req () req) {
		return this.roomService.findAll(req.user.userId);
	}

	@Post ('DMcreate/:receiverId') 
	async createDM(@Req () req, @Param('receiverId', ParseIntPipe) receiverId: number) {
		return this.roomService.createDM(req.user.userId, receiverId);
	}

	@Post ('join/:roomId')
	async joinRoom(@Req () req, @Param('roomId', ParseIntPipe) roomId: number, @Body('password') password: string) {
		return this.roomService.joinRoom(req.user.userId, roomId, password);
	}

	@Post ('leave/:roomId')
	async leaveRoom (@Req () req, @Param('roomId', ParseIntPipe) roomId: number) {
		return this.roomService.leaveRoom(req.user.userId, roomId);
	}
}
