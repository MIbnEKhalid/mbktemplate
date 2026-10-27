import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3080', 10),
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3080}`,
    isProduction: process.env.NODE_ENV === 'production',
    dbType: (process.env.DB_TYPE || 'sqlite').toLowerCase(),
    sqlitePath: process.env.SQLITE_PATH || './data/app.db',
    databaseUrl: process.env.NEON_POSTGRES || process.env.DATABASE_URL,
    appName: process.env.APP_NAME || 'MBKTemplate',
};

export default config;
