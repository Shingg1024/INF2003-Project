const mysql = require('mysql');

// Create and export a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: process.env.USER,
    database: 'inf2003'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
    connection.release(); 
});

module.exports = pool;
