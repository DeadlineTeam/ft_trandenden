import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';


// game dependencies
import { GameGateway } from './game/game.gateway'
import { GameService } from './game/services/game.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Pong } from './game/services/match.service';


@Module({
  imports: [
	AuthModule,
	ConfigModule.forRoot({isGlobal: true}),
	PrismaModule,
	UsersModule,
	ScheduleModule.forRoot (),
	],
  controllers: [AppController],
  providers: [AppService, GameGateway, GameService, Pong],})
export class AppModule {}
