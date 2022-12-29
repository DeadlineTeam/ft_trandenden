
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OnlineService {
	constructor (
		private readonly prisma: PrismaService,

	) {}
	OnlineUser = new Set<number> ()

	addOnline (userId: number) {

		this.OnlineUser.add (userId);
	}
	removeOnline (userId: number) {
		this.OnlineUser.delete (userId);
	}

}
