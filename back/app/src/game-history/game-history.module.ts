import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import {UsersModule} from '../users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameHistoryController } from './game-history.controller';

@Module({
	imports: [UsersModule, PrismaModule],
	providers: [GameHistoryService],
	controllers: [GameHistoryController]
})
export class GameHistoryModule {}
