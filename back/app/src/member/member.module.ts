import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OnlineModule } from 'src/online/online.module';

@Module({
	imports: [
		PrismaModule,
		OnlineModule
	],
	controllers: [MemberController],
	providers: [MemberService],
	exports: [MemberService]
})
export class MemberModule {}
