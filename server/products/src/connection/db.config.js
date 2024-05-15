import {PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "../global/_var.js"

export const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}