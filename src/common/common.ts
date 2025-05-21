export interface IDBSettings {
  host: string

  port: number

  user: string

  password: string

  database: string
}

export const GetDBSettings = (): IDBSettings => {
  const env = process.env.NODE_ENV

  if (env == 'development')
    return {
      host: '127.0.0.1', //'58.84.143.251',

      port: parseInt('3306'),

      user: 'kevin',

      password: 'Squogg27',

      database: 'Checkaroo',
    }
  else
    return {
      host: process.env.host!, //'58.84.143.251',

      port: parseInt(process.env.port!),

      user: process.env.user!,

      password: process.env.password!,

      database: process.env.database!,
    }
}