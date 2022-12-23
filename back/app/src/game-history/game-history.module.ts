import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import {UsersModule} from '../users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [UsersModule, PrismaModule],
	providers: [GameHistoryService]
})
export class GameHistoryModule {}
