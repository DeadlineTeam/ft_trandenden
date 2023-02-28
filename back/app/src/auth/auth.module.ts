import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { FortyTwoStrategy } from './42.strategy';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import {TwofaService} from './2fa.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, PassportModule.register({failureRedirect: `${process.env.FRONTEND_URL}`}), 
	JwtModule.registerAsync({
		imports: [ConfigModule],
      	inject: [ConfigService],
		useFactory: async (configService: ConfigService) => ({
			secret: configService.get('JWT_SECRET'),
			signOptions: {
				expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
			},
		}),
	})],
	providers: [AuthService, FortyTwoStrategy, JwtStrategy, TwofaService],
	exports: [AuthService, TwofaService],
	controllers: [AuthController],
})
export class AuthModule {}

// secret: 'HelloWorld',
// signOptions: { expiresIn: '7d'}