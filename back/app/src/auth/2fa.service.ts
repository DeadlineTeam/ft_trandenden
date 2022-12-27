import { Injectable} from "@nestjs/common";
import { authenticator } from 'otplib';
// import otplib from 'otplib';
import { UsersService } from '../users/users.service';
import { UserDto } from "src/users/dto/User.dto";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';
import { toFileStream } from 'qrcode';


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

	async verifyToken(id: number, tfaCode: string) : Promise<boolean> {
		const user: UserDto = await this.usersService.findById(id);
		// console.log(user);
		console.log(tfaCode);
		if (!user)
			return false;
		return authenticator.verify({
			token: tfaCode,
			secret: user.twofasecret,
		})
	}
}