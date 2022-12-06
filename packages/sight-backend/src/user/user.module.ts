import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController, UserPublicController } from './user.controller';
import { Session } from 'src/auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [UserService],
  controllers: [UserPublicController, UserController],
})
export class UserModule {}
