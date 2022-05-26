import seq, { DataTypes, Model, Sequelize } from 'sequelize';
import { cryptPassword, generateID } from '@utils/security';
import { currentTimestamp } from '@utils/util';
import { UserLanguages } from '@dtos/users.dto';

export class UsersModel extends Model {
  public id: string;
  public username: string;
  public password: string;
  public role: number;
  public createdAt: Date;
  public updatedAt: Date;

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
        locale: {
          type: seq.ENUM(typeof UserLanguages),
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: 'users',
        sequelize,
        indexes: [],
        hooks: {
          beforeCreate: async record => {
            record.id = generateID();
            record.createdAt = new Date();
            record.updatedAt = new Date();
          },
          beforeUpdate: async record => {
            if (record.password) {
              record.password = await cryptPassword(record.password);
            }
            record.updatedAt = new Date();
          },
        },
      },
    );
    return UsersModel;
  }
}
