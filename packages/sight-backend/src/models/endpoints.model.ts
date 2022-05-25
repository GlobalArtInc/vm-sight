import { DataTypes, Model, Sequelize } from 'sequelize';
import { generateID } from '@utils/security';

export class EndpointsModel extends Model {
  id: string;
  name: string;
  type: number;
  public_url: string;
  host: string;
  groupId: string;
  tls: number;
  tls_ca: number;
  tls_cert: number;
  tls_key: number;

  public static associate() {
    return;
  }

  public static initModel(sequelize: Sequelize): typeof EndpointsModel {
    EndpointsModel.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        type: {
          type: DataTypes.INTEGER,
        },
        public_url: {
          type: DataTypes.STRING,
        },
        host: {
          type: DataTypes.STRING,
        },
        groupId: {
          type: DataTypes.INTEGER,
        },
        tags: {
          type: DataTypes.STRING,
        },
        tls: {
          type: DataTypes.INTEGER,
        },
        tls_ca: {
          type: DataTypes.INTEGER,
        },
        tls_cert: {
          type: DataTypes.INTEGER,
        },
        tls_key: {
          type: DataTypes.INTEGER,
        },
      },
      {
        tableName: 'endpoints',
        timestamps: false,
        sequelize,
        indexes: [],
        hooks: {
          beforeCreate: async record => {
            record.id = generateID();
            if (record.tls_ca || record.tls_cert || record.tls_key) record.tls = 1;
            record.tls_ca = record.tls_ca ? 1 : 0;
            record.tls_cert = record.tls_cert ? 1 : 0;
            record.tls_key = record.tls_key ? 1 : 0;
          },
        },
      },
    );
    return EndpointsModel;
  }
}
