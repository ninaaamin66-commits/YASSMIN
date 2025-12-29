// db.js
const { Pool } = require('pg'); // PostgreSQL

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://yassmin_db_user:MZo6Nxf0C8FZ89EyqUEG7pqeDpVSkSta@dpg-d58gbd6mcj7s73cggb0g-a:5432/yassmin_db',
    ssl: { rejectUnauthorized: false } 
});

function query(sql, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = [];
    }
    pool.query(sql, params)
        .then(res => cb(null, res.rows))
        .catch(err => cb(err));
}

module.exports = { query };
