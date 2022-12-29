import { Injectable} from "@nestjs/common";
import { authenticator } from 'otplib';
// import otplib from 'otplib';
import { UsersService } from '../users/users.service';
import { UserDto } from "src/users/dto/User.dto";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import * as bcrypt from 'bcrypt';


@Injectable()
export class TwofaService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	)
	{}
	
	async generateSecret(id: number, username:string) : Promise<string>{
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(username, this.configService.get('2FAUTH'), secret);
		await this.usersService.setTwofaSecret(id, secret);
		return otpauthUrl;
	}

	async pipeqrcode(res: Response, otpauthUrl: string) {
		return toFileStream(res, otpauthUrl);
	}



	async verifyToken(username: string, tfaCode: string) : Promise<boolean> {
		const user: UserDto = await this.usersService.findByuername(username);
		console.log("verifyToken",tfaCode);
		if (!user)
			return false;
		return authenticator.verify({
			token: tfaCode,
			secret: user.twofasecret,
		});
	}

	async twoFaKey(username: string): Promise<string> {
		const rounds = 10;
		const key = await bcrypt.hash(username, rounds);
		return key + "||" + username;
	}

	async verifyTwoFaKey(key: string): Promise<string> {
		// console.log(key);
		const [hash, username] = key.split("||");
		const isMatch = await bcrypt.compare(username, hash);
		if (isMatch)
			return username;
		return null;
	}
}