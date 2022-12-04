import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { Session } from './auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), PassportModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
