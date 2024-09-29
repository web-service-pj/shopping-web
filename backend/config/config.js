require('dotenv').config();

module.exports = {
  development: {
    username: "user",
    password: "root",
    database: "shop_db",
    host: "113.198.66.75",
    port: "13047",
    dialect: "mysql"
  },
  test: {
    username: "user",
    password: "root",
    database: "shop_db",
    host: "113.198.66.75",
    port: "13047",
    dialect: "mysql"
  },
  production: {
    username: "user",
    password: "root",
    database: "shop_db",
    host: "113.198.66.75",
    port: "13047",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};