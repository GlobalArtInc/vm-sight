import {DataTypes, Model, Sequelize} from "sequelize";

export class UsersModel extends Model {
    public id: string;
    public username: string;
    public password: string;
    public role: number;
    public createdAt: number;
    public updatedAt: number;

    public static associate() {
        return;
    }

    public async getUsers(): Promise<UsersModel[]> {
        return UsersModel.findAll();
    }

    public async getUser(id: string) {
        return UsersModel.findOne({where: {id}})
    }

    public static initModel(sequelize: Sequelize): typeof UsersModel {
        UsersModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.STRING
            },
            username: {
                unique: true,
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING
            },
            role: {
                type: DataTypes.INTEGER
            },
            createdAt: {
                type: DataTypes.INTEGER
            },
            updatedAt: {
                type: DataTypes.INTEGER
            }
        }, {
            tableName: "users",
            sequelize,
            indexes: []
        })
        return UsersModel;
    }

}
