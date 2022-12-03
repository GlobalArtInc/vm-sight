import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './common/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getOneBy({ email });
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async authServiceByCreds(dto: LoginUserDto) {
    //u77
  }
}
