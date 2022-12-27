import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameHistoryModule } from './game-history/game-history.module';

// game dependencies
import { GameGateway } from './game/game.gateway'
import { GameService } from './game/services/game.service';

import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from './game/game.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';

 
@Module({
  imports: [
	ChatModule,
	GameModule,
	AuthModule,
	ConfigModule.forRoot({isGlobal: true}),
	PrismaModule,
	UsersModule,
	ScheduleModule.forRoot (),
	MulterModule.register({
		dest: './uploads',
	}),
	ServeStaticModule.forRoot({
		rootPath: join(__dirname, '..', 'uploads'),
		serveRoot: '/uploads',
		renderPath: '/uploads',
	  }),
	GameHistoryModule,
	ProfileModule,
	],
  controllers: [AppController],
  providers: [AppService],})
export class AppModule {}
