import pg from 'pg';

// pools will use environment variables
// for connection information

const {Pool} = pg;

const { PGPORT, PGPASSWORD, PGDATABASE, PGUSER, PGHOST } = process.env;

const pool = new Pool({
    user: PGUSER,
    host:PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT,
});

export default pool;