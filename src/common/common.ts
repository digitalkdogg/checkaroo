import mysql from "mysql2/promise";

export interface IDBSettings {
  host: any
  port: any
  user: any
  password: any
  database: any
}

export const GetDBSettings = (): IDBSettings => {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_DATABASE,
    }

}


export const createConnection = async () => {
  let connection;
  if (!connection ) {
    connection = await mysql.createConnection(GetDBSettings())
  }

  return {
    connection
  }
}