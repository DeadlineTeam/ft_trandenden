import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./services/game.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { GameHistoryModule } from "src/game-history/game-history.module";
@Module ({
	imports: [
		UsersModule,
		AuthModule,
		PrismaModule,
		GameHistoryModule,
	],
	providers: [GameService, GameGateway]
})
export class GameModule {}