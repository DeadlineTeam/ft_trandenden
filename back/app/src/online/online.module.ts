import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { OnlineGateway } from './online.gateway';

@Module({
	imports: [
		PrismaModule,
		AuthModule,
	],
	exports: [],
	providers: [
		OnlineGateway
	],
})
export class OnlineModule {}