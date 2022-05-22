import UsersService from "../services/users.service";
import usersService from "../services/users.service";

class IndexController {
    public usersService = new UsersService();

    public getVersion(req, res) {
        return res.send({version: "1.0"})
    }

    public me(req, res) {
        return res.status(200).json(req.user)
    }

    public motd(req, res) {
        return res.status(200).json({response: true})
    }

}

export default IndexController;
