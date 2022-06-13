import UsersService from '@services/users.service';

class IndexController {
  public usersService = new UsersService();

  /**
   * @openapi
   *   /version:
   *     get:
   *       tags:
   *       - auth
   *       summary: Fetch the SIGHT version
   *       responses:
   *         200:
   *           description: 'Ok'
   */
  public getVersion(req, res) {
    return res.send({ version: '1.0' });
  }

  /**
   * @openapi
   *   /me:
   *     get:
   *       tags:
   *       - auth
   *       summary: Fetch the current user info
   *       responses:
   *         200:
   *           description: 'Ok'
   */
  public me(req, res) {
    const { id, username, role, locale, createdAt } = req.user;
    return res.status(200).json({ id, username, role, locale, createdAt });
  }

  /**
   * @openapi
   *   /language:
   *     put:
   *       tags:
   *       - users
   *       summary: Change user language
   *       parameters:
   *       - name: body
   *         in: body
   *         description: ChangeUserLanguageDto
   *         required: true
   *         schema:
   *           $ref: '#/definitions/changeUserLanguageDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         400:
   *           description: 'Bad Request'
   *         500:
   *           description: 'Server Error'
   */
  public setLanguage = async (req, res) => {
    await this.usersService.changeLanguage(req.user.id, req.body.language);
    return res.status(200).json();
  };

  public motd(req, res) {
    return res.status(200).json({ response: true });
  }
}

export default IndexController;
