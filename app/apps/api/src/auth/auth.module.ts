import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SharedModule } from '@app/shared';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [SharedModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
