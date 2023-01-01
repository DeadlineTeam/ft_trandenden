import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { GameHistoryModule } from 'src/game-history/game-history.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [PrismaModule, UsersModule, GameHistoryModule, FriendModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
