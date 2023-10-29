const mysql = require('mysql2');
const Client = require('ssh2').Client;

// Create an SSH connection
const sshConfig = {
    host: process.env.SSH_HOSTNAME, // SSH server hostname or IP address
    username: process.env.SSH_USERNAME, // SSH username
    password: process.env.SSH_PASSWORD, // SSH password
};

// Create and export a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1', // Localhost or the correct MySQL server hostname or IP
    user: process.env.MYSQL_USER, // SSH username
    password: process.env.MYSQL_PASSWORD, // SSH password
    database: 'inf2003',
});

const sshConnection = new Client();

sshConnection.on('ready', () => {
    sshConnection.forwardOut(
        '127.0.0.1', // Local MySQL host
        0, // Local MySQL port (0 for automatic assignment)
        '127.0.0.1', // Replace with 'localhost' if MySQL is on the same machine, or specify the MySQL server's IP or hostname
        3306, // Default MySQL port
        (err, stream) => {
            if (err) throw err;

            pool.config.connectionConfig.stream = stream; // Attach the SSH tunnel stream to the MySQL connection pool

            // The pool is now configured to use the SSH tunnel stream for MySQL connections
            console.log('SSH tunnel to MySQL server established');
        }
    );
});
sshConnection.connect(sshConfig);

module.exports = pool;
