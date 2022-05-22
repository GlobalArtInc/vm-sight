import {UsersModel} from "../models";
import BadRequestException from "../exceptions/BadRequestException";
import HttpException from "../exceptions/HttpException";
import {CreateAdminDto} from "@dtos/users.dto";
import ConflictException from "../exceptions/ConflictException";
import {cryptPassword, getGUID} from "../utils/Security";
import DB from "../databases";

class UsersService {
    public async checkAdmin() {
        const user = await UsersModel.findAll({where: {role: 1}});

        if (user.length > 0) {
            return {response: true};
        } else {
            throw new HttpException(400, "No administrator account found in the database")
        }
    }

    public async initAdmin(createAdminDto : CreateAdminDto) {
        const user = await UsersModel.findAll({where: {role: 1}});
        if (user.length === 0) {
            if (createAdminDto.Username && createAdminDto.Password) {
                const hash = await cryptPassword(createAdminDto.Password);
                const id = getGUID();
                await new UsersModel({
                    id,
                    username: createAdminDto.Username,
                    password: hash,
                    role: 1,
                    createdAt: DB.Sequelize.fn('strftime', '%s', 'now'),
                    updatedAt: DB.Sequelize.fn('strftime', '%s', 'now')
                }).save();
                return {status: 201}
            } else {
                throw new BadRequestException("No username or password")
            }
        } else {
            throw new ConflictException("Admin is already exists")
        }
    }

    public async getAll() {
        return UsersModel.findAll({attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt']});
    }

    public async getById(id: string) {
        return UsersModel.findOne({
            where: {id},
            attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt']
        });
    }

}

export default UsersService;
