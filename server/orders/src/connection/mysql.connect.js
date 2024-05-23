import mysql from "mysql2/promise"
import {dbConfig} from "./db.config.js"

export const pool = mysql.createPool(dbConfig)
