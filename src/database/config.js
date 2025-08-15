
require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

module.exports = {
  production: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  },
  development: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  },
  test: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
};
