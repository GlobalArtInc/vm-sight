import { DataTypes, Model, Sequelize } from 'sequelize';
import { generateID } from '@utils/security';

export class EndpointsModel extends Model {
  id: string;
  name: string;
  type: number;
  public_url: string;
  url: string;
  groupId: string;
  tls: boolean;
  tls_ca: boolean;
  tls_cert: boolean;
  tls_key: boolean;

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
        url: {
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
          beforeCreate: async endpoint => {
            endpoint.id = generateID();
            if (endpoint.url === '/var/run/docker.sock') {
              endpoint.type = 2;
            }
          },
        },
      },
    );
    return EndpointsModel;
  }
}
