import { gameMode} from "@prisma/client";
import { gameStatus } from "@prisma/client";

export class GameDto {
	mode : gameMode;
	status : gameStatus;
	player1: string;
	player2: string;
}

