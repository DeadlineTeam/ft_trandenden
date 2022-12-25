import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./services/game.service";
import { SocketUserService } from "./services/SocketUserService";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module ({
	imports: [
		UsersModule,
		AuthModule,
		PrismaModule,
	],
	providers: [SocketUserService, GameService, GameGateway]
})
export class GameModule {}