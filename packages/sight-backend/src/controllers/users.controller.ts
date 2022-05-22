import UsersService from "../services/users.service";
import HttpException from "../exceptions/HttpException";
import {CreateAdminDto} from "@dtos/users.dto";

class UsersController {
    public usersService = new UsersService();

    public usersCheck = async (req, res) => {
        res.status(200).json(await this.usersService.checkAdmin())
        return;
    }

    public initAdministrator = async (req, res) => {
        const createAdminDto: CreateAdminDto = req.body
        res.status(201).json(await this.usersService.initAdmin(createAdminDto));
        return;
    }

    public getUsers = async (req, res) => {
        res.status(200).json(await this.usersService.getAll())
    }

    public getUserById = async (req, res) => {
        res.status(200).json(await this.usersService.getById(req.params.id))
    }


}

export default UsersController;
