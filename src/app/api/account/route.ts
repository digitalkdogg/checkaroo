import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings, createConnection } from '@/common/common'

let connectionParams = GetDBSettings()


export async function GET(request: NextRequest) {
  try {
    const connection = await createConnection()

    let get_exp_query = ''
    let userid = request.nextUrl!.searchParams!.get('userid')!;

    var query = {
      select : '*',
      from : 'Account',
      where : 'user_id = "' + userid + '"'
    }

    get_exp_query = 'select ' + query.select + ' from ' + query.from + ' where ' + query.where

    const [results, fields] = await connection.connection.query(get_exp_query)
    connection.connection.end()
    return NextResponse.json({results})
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,
     returnedStatus: 200,
    }
    return NextResponse.json(response, { status: 200 })
  }
}