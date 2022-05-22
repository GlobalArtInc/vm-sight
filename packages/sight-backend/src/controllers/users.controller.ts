import UsersService from "../services/users.service";
import HttpException from "../exceptions/HttpException";
import {CreateAdminDto, UpdateUserDto} from "@dtos/users.dto";
import ForbiddenException from "../exceptions/ForbiddenException";
import NotFoundException from "../exceptions/NotFoundException";

class UsersController {
    public usersService = new UsersService();

    public usersCheck = async (req, res) => {
        res.status(200).json(await this.usersService.checkAdmin())
        return;
    }

    public initAdministrator = async (req, res) => {
        const createAdminDto : CreateAdminDto = req.body
        res.status(201).json(await this.usersService.initAdmin(createAdminDto));
        return;
    }

    /**
     * @openapi
     *   /users:
     *     get:
     *       tags:
     *       - users
     *       summary: Fetch all users
     *       responses:
     *         200:
     *           description: 'Ok'
     *         500:
     *           description: 'Server Error'
     */
    public getUsers = async (req, res) => {
        res.status(200).json(await this.usersService.getAll())
    }

    /**
     * @openapi
     *   /users:
     *     post:
     *       tags:
     *       - users
     *       summary: Create a user
     *       parameters:
     *       - name: body
     *         in: body
     *         description: CreateUserDto
     *         required: true
     *         schema:
     *           $ref: '#/definitions/createUserDto'
     *       responses:
     *         200:
     *           description: 'Ok'
     *         401:
     *           description: 'Bad Request'
     *         500:
     *           description: 'Server Error'
     */
    public createUser = async (req, res) => {
        await this.usersService.create(req.body)
        return res.status(201).json({status: 201});
    }

    /**
     * @openapi
     *   /users/{id}:
     *     get:
     *       tags:
     *       - users
     *       summary: Fetch user by ID
     *       parameters:
     *       - name: id
     *       in: path
     *       description: User ID
     *       required: true
     *       type: string
     *       responses:
     *         200:
     *           description: 'Ok'
     *         404:
     *           description: 'User not found'
     *         500:
     *           description: 'Server Error'
     */
    public getUserById = async (req, res) => {
        const user = await this.usersService.getById(req.params.id);
        if (user) {
            res.status(200).json(user)
        } else {
            throw new NotFoundException("User not found")
        }
    }

    /**
     * @openapi
     *   /users/{id}:
     *     put:
     *       tags:
     *       - users
     *       summary: Update user by ID
     *       parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         type: string
     *       - name: body
     *         in: body
     *         description: UpdateUserDto
     *         required: true
     *         schema:
     *           $ref: '#/definitions/updateUserDto'
     *       responses:
     *         200:
     *           description: 'Ok'
     *         404:
     *           description: 'User not found'
     *         500:
     *           description: 'Server Error'
     */
    public update = async (req, res) => {
        const user = await this.usersService.getById(req.params.id);
        if (user) {
            await this.usersService.update(req.params.id, req.body)
            return res.status(200).json({status: 200})
        } else {
            throw new NotFoundException("User not found")
        }
    }

    /**
     * @openapi
     *   /users/{id}:
     *     delete:
     *       tags:
     *       - users
     *       summary: Delete user by ID
     *       parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         type: string
     *       responses:
     *         200:
     *           description: 'Ok'
     *         401:
     *           description: 'Bad Request'
     *         500:
     *           description: 'Server Error'
     */
    public remove = async (req, res) => {
        if (req.params.id === req.user.id)
            throw new ForbiddenException("You can't remove yourself");
        return res.status(200).json(await this.usersService.remove(req.params.id))
    }

}

export default UsersController;
