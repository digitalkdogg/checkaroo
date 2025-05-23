import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings } from '@/common/common'

let connectionParams = GetDBSettings()


export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(connectionParams)

    let get_exp_query = ''
    let userid = request.nextUrl!.searchParams!.get('userid')!;

    get_exp_query = 'SELECT * FROM Account where user_id = ?' 

    let values: any[] = [userid]

    const [results, fields] = await connection.execute(get_exp_query, values)

    connection.end()

   return NextResponse.json({ data: fields.map((f) => f.name), results })
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    }
    return NextResponse.json(response, { status: 200 })
  }
}