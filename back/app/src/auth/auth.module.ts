import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { FortyTwoStrategy } from './42.strategy';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, 
	JwtModule.register({
		secret: 'HelloWorld',
		signOptions: { expiresIn: '0'}
	})],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
