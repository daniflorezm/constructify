import path from 'path';
import { Knex } from 'knex';
import { app } from "electron"; 

const isProd = app?.isPackaged ?? false;

export const dbPath = isProd
  ? path.join(process.resourcesPath, "app", "dist", "data.db") 
  : path.resolve(__dirname, "..", "..", "data.db"); 

console.log(`📂 Base de datos en uso: ${dbPath}`);



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