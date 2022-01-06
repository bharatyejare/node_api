const mysql = require("mysql");
const connection = mysql.createConnection({
host: "localhost",
user: "demo",
password: "password",
database: "students"
});
connection.connect(function(err) {
if (err) throw err;
   console.log('Database is connected successfully !');
});
module.exports = connection;