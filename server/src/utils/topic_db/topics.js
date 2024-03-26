const sql = require("mssql");
var config = {
  user: "SA", 
  password: "admin123", 
  server: "localhost:1433", 
  database: "Topics", 
  options: {
    encrypt: false, 
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