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

export const formatDouble = (amount:number) => {
  return amount.toFixed(2)
}

export const convertToNiceDate = (mydate:string) => {
    let dadate = new Date(mydate);
    let datestr = ''
    let damonth = dadate.getMonth() + 1
    let damonthstr = damonth.toString()
    let daday = dadate.getDate();
    let dadaystr = daday.toString();

    if (damonth < 10) {
       damonthstr = '0' + damonth
    }

    if (daday < 10) {
      dadaystr = '0'+ daday
    }

    datestr = damonthstr  + '-' + dadaystr+ '-' + dadate.getFullYear()
    return datestr;
}