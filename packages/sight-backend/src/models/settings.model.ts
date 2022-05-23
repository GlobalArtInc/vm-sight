import { DataTypes, Model, Sequelize } from "sequelize";

export class SettingsModel extends Model {
  public key: string;
  public value: string;

  public static associate() {
    return;
  }

  static async getSettings(): Promise<SettingsModel[]> {
    return SettingsModel.findAll({});
  }

  static async getSetting(key: string) {
    const setting = await SettingsModel.findOne({ where: { key } });
    return setting ? setting.value : "";
  }

  public static initModel(sequelize: Sequelize): typeof SettingsModel {
    SettingsModel.init(
      {
        key: {
          primaryKey: true,
          type: DataTypes.STRING,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: "settings",
        timestamps: false,
        sequelize,
        indexes: [],
      }
    );
    return SettingsModel;
  }
}
