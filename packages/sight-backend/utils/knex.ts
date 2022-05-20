import knex from 'knex';
import {dataDir} from "../constants";

/**
 * @type {knex}
 */
export default knex({
    client: 'sqlite3',
    connection: {
        filename: dataDir + `/base.db`
    }
})
