export interface IDBSettings {
    host: string
  
    port: number
  
    user: string
  
    password: string
  
    database: string
  }
  
  export const GetDBSettings = (): IDBSettings => {
    return {
        host: '192.168.2.48',
        port: parseInt('3306'),
        user: 'Kevin',
        password: 'Squogg27',
        database: 'Checkaroo'
    }

  }