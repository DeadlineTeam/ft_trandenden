import { Controller, Req, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	async create(@Req () request, @Body() createRoomDto: CreateRoomDto) {
		return this.roomService.create(createRoomDto, request.user.userId);
	}
}
