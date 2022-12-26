import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./services/game.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module ({
	imports: [
		UsersModule,
		AuthModule,
		PrismaModule,
	],
	providers: [GameService, GameGateway]
})
export class GameModule {}