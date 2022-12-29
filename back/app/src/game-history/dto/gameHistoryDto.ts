import { UserDto } from "src/users/dto/User.dto";
import { gameMode} from "@prisma/client";

export class GameHistoryDto {
	player1: UserDto;
	player2: UserDto;
	player1Score: number;
	player2Score: number;
	gameMode: gameMode;
}
