const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "photo_gallery_db",
});

module.exports = pool;
