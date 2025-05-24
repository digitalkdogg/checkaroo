import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings, queryDB } from '@/common/common'

let connectionParams = GetDBSettings()


export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(connectionParams)

    let get_exp_query = ''
    let userid = request.nextUrl!.searchParams!.get('userid')!;

    var query = {
      select : '*',
      from : 'Account',
      where : 'user_id = "' + userid + '"'
    }

    get_exp_query = 'select ' + query.select + ' from ' + query.from + ' where ' + query.where

    //get_exp_query = 'SELECT * FROM Account where user_id = ?' 

    //let values: any[] = [userid]

    //const results = await queryDB(connection, request, get_exp_query)
    //const fields = results

    const [results, fields] = await connection.query(get_exp_query)

    connection.end()
    return NextResponse.json({results})
    //return NextResponse.json({ data: fields.map((f) => f.name), results })
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,
     returnedStatus: 200,
    }
    return NextResponse.json(response, { status: 200 })
  }
}