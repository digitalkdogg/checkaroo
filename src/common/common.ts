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

export const queryDB = ( get_query: string)  => {


  return {
    'testing' : get_query
  }
}