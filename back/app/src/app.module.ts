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
import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from './game/game.module';


 
@Module({
  imports: [
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
	],
  controllers: [AppController],
  providers: [AppService],})
export class AppModule {}
