import {AuthUserDto} from "@dtos/users.dto";
import AuthService from "../services/auth.service";

class AuthController {
    public authService = new AuthService()

    public login = async (req, res) => {
        const userData: AuthUserDto = req.body;
        const jwt = await this.authService.login(userData)
        return res.send({jwt})
    }
}

export default AuthController;
