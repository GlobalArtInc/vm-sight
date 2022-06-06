import { AuthUserDto } from '@dtos/users.dto';
import { UsersModel } from '../models';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { comparePassword } from '@utils/security';
import fs from 'fs';
import { jwtSecret } from '../constants';
const jwt = require('jsonwebtoken');

class AuthService {
  public async login(userData: AuthUserDto) {
    if (userData.Code) {
    } else {
      const user = await UsersModel.findOne({
        where: {
          username: userData.username,
        },
      });
      if (user && (await comparePassword(userData.password, user.password))) {
        return new Promise((resolve, reject) => {
          jwt.sign(
            {
              id: user.id,
            },
            fs.readFileSync(jwtSecret),
            {
              expiresIn: '365d',
              subject: 'userInfo',
            },
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            },
          );
        })
          .then(jwt => {
            return jwt;
          })
          .catch(err => {
            throw new NotAuthorizedException(err);
          });
      } else {
        throw new NotAuthorizedException();
      }
    }
  }
}

export default AuthService;
