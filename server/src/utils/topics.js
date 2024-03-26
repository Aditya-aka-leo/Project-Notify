const sql = require("mssql");
var config = {
  user: "SA", // Database username
  password: "admin123", // Database password
  server: "localhost:1433", // Server IP address
  database: "Topics", // Database name
  options: {
    encrypt: false, // Disable encryption
  },
};
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));


module.exports = { poolPromise };