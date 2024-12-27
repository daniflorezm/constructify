import knex from 'knex';
import KnexDatabaseConfiguration from './knexdatabaseconfiguration';

const knexdb = knex(KnexDatabaseConfiguration);

export default knexdb;
