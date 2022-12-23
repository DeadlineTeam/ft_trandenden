
import { Injectable } from "@nestjs/common";


Injectable ()
export class SocketUserService {
	socketUsers: Map<string, string> = new Map ();
	constructor () {}

	insert (clientId: string, userName: string): void {
		this.socketUsers.set (clientId, userName);
	}
	get (clientId: string): string | null {
		return this.socketUsers.get (clientId);
	}
	remove (clientId: string): void {
		this.socketUsers.delete (clientId)
	}
}



