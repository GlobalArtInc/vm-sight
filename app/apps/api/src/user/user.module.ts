import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SharedModule } from '@app/shared';
import { UserControllerPublic } from './controllers/user-public.controller';
import { UserControllerProtected } from './controllers/user-protected.controller';

@Module({
  imports: [SharedModule],
  providers: [UserService],
  controllers: [UserControllerPublic, UserControllerProtected],
})
export class UserModule {}
