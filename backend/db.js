const { Pool } = require('pg'); // PostgreSQL

const pool = new Pool({
    host: 'dpg-d58gbd6mcj7s73cggb0g-a',      
    port: 5432,
    user: 'yassmin_db_user',                  
    password: 'MZo6Nxf0C8FZ89EyqUEG7pqeDpVSkSta', 
    database: 'yassmin_db',                    
    ssl: { rejectUnauthorized: false } 
});

pool.connect(err => {
    if (err) throw err;
    console.log('Connexion PostgreSQL DB réussie');
});

module.exports = pool;
