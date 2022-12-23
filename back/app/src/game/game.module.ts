import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./services/game.service";
import { SocketUserService } from "./services/SocketUserService";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";

@Module ({
	imports: [UsersModule, AuthModule],
	providers: [SocketUserService, GameService, GameGateway]
})
export class GameModule {}