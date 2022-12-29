import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OnlineService } from './online.service';
import { GateWayGuard } from './gatway.guard';
import { AuthModule } from 'src/auth/auth.module';
import { OnlineGateway } from './online.gateway';

@Module({
	imports: [
		PrismaModule,
		AuthModule,
	],
	exports: [],
	providers: [
		OnlineService,
		GateWayGuard,
		OnlineGateway
	],
})
export class OnlineModule {}