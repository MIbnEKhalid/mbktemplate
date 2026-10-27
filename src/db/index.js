import { PostgresAdapter, SqliteAdapter, postgresDialect, BaseRepository, defaultAdapter } from 'mbkauthe';
import { pool, testDbConnection } from './connection.js';

const adapter = defaultAdapter;

export {
    pool,
    testDbConnection,
    PostgresAdapter,
    SqliteAdapter,
    postgresDialect,
    BaseRepository,
    defaultAdapter,
    adapter
};

export default defaultAdapter;