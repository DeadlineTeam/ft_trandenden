import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


// const errorFormat = 'pretty' | 'colorless' | 'minimal';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{

	// add log options
	constructor() {
		super({
			errorFormat: 'minimal',
		});
	}
	async onModuleInit() {
		await this.$connect();
	  }	
	async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}