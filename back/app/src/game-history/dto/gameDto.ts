import { gameMode} from "@prisma/client";
import { gameStatus } from "@prisma/client";

export class GameDto {
	status : gameStatus;
	player1: string;
	player2: string;
}

