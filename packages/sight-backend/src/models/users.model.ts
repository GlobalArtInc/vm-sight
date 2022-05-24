import { DataTypes, Model, Sequelize } from 'sequelize';
import { cryptPassword, generateID } from '@utils/security';
import { currentTimestamp } from '@utils/util';

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

  public static initModel(sequelize: Sequelize): typeof UsersModel {
    UsersModel.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        username: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
        role: {
          type: DataTypes.INTEGER,
        },
        createdAt: {
          type: DataTypes.INTEGER,
        },
        updatedAt: {
          type: DataTypes.INTEGER,
        },
      },
      {
        tableName: 'users',
        sequelize,
        indexes: [],
        hooks: {
          beforeCreate: async user => {
            user.id = generateID();
            user.createdAt = currentTimestamp();
          },
          beforeUpdate: async user => {
            if (user.password) {
              user.password = await cryptPassword(user.password);
            }
            user.updatedAt = currentTimestamp();
          },
        },
      },
    );
    return UsersModel;
  }
}
