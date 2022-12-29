import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/chat.dto';


@UseGuards (JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
}


