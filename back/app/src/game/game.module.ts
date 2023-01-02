import { Controller, Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./services/game.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { GameHistoryModule } from "src/game-history/game-history.module";
import { GameController } from "./game.controller";
import { OnlineModule } from "src/online/online.module";

@Module ({
	imports: [
		UsersModule,
		AuthModule,
		PrismaModule,
		GameHistoryModule,
		OnlineModule,
	],
	providers: [GameService, GameGateway],
	controllers: [
		GameController
	]
})
export class GameModule {}