import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { OnlineGateway } from './online.gateway';
import { UsersModule } from 'src/users/users.module';
import { OnlineService } from './online.service';

@Module({
	imports: [
		UsersModule,
		PrismaModule,
		AuthModule,
	],
	exports: [
		OnlineService,
	],
	providers: [
		OnlineGateway, OnlineService,
	],
})
export class OnlineModule {}