import { DataTypes, Model, Sequelize } from "sequelize";

export class EndpointsModel extends Model {
  id: string;
  name: string;
  type: number;
  public_url: string;
  url: string;
  groupId: string;
  tls: string;
  tls_ca: string;
  tls_cert: string;
  tls_key: string;

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
        tableName: "endpoints",
        timestamps: false,
        sequelize,
        indexes: [],
      }
    );
    return EndpointsModel;
  }
}
