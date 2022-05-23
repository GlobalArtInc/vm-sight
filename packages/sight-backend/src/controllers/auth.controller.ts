import { AuthUserDto } from "@dtos/users.dto";
import AuthService from "@services/auth.service";

class AuthController {
  public authService = new AuthService();

  /**
   *
   * @openapi
   *   /auth:
   *     post:
   *       tags:
   *       - auth
   *       summary: Login user
   *       parameters:
   *       - name: body
   *         in: body
   *         description: AuthUserDto
   *         required: true
   *         schema:
   *           $ref: '#/definitions/AuthUserDto'
   *       responses:
   *         200:
   *           description: 'JWT'
   *         401:
   *           description: 'Bad Request'
   *         500:
   *           description: 'Server Error'
   */
  public login = async (req, res) => {
    const userData: AuthUserDto = req.body;
    const jwt = await this.authService.login(userData);
    return res.send({ jwt });
  };
}

export default AuthController;
