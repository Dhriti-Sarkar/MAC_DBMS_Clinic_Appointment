const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "dhritisarkar",
    database: "clinic_db",
    socketPath: "/tmp/mysql.sock"  // Use the socket path you found
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MariaDB (clinic_db)");
    }
});

module.exports = connection;