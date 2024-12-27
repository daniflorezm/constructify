import path from 'path';
import { Knex } from 'knex';

const dbPath = path.resolve(__dirname, '..', '..', 'data.db');


const KnexDatabaseConfiguration: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath, 
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, '..', '..', 'migrations'),
    extension: 'ts',
  },
};
export default KnexDatabaseConfiguration;