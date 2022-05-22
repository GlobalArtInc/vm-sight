import * as dbModels from '../models'
import {Sequelize} from "sequelize";
import {dataDir} from "../constants";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${dataDir}/base.db`,
    logging: false
});
require('sequelize-isunique-validator')(Sequelize);

const DB = {
    ...dbModels,
    sequelize,
    Sequelize
}

function initAssociations() {
    Object.keys(dbModels).forEach((key: string) => {
        dbModels[key].initModel(sequelize);
    });

    Object.keys(dbModels).forEach((key: string) => {
        dbModels[key].associate();
    });
}
initAssociations();

export default DB;
