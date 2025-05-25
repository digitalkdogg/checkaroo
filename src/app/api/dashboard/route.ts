import { NextResponse, NextRequest } from 'next/server'
//import mysql from 'mysql2/promise'
import { GetDBSettings, createConnection} from '@/common/common'

let connectionParams = GetDBSettings()

export async function GET(request: NextRequest) {
  try {
    const connection = await createConnection()

    let get_query = ''
    let accountid = request.nextUrl!.searchParams!.get('accountid')!;


    accountid='1'

    let joinarr = [
        'inner join Clients on Clients.client_id = Transactions.client_id',
        'inner join Category on Category.category_id = Transactions.category_id' 
    ];

    var query = {
      select : '*',
      from : 'Transactions',
     where : 'account_id = "' + accountid + '"',
    }



    get_query = 'select ' + query.select + ' from ' + query.from

    joinarr.forEach(item => {
        get_query = get_query + ' ' + item
    });

    get_query = get_query + ' where ' + query.where  



    const [results] = await connection.connection.query(get_query)
  //  const [results, fields] = await connection.connection.query(get_exp_query)
    connection.connection.end()
    return NextResponse.json({ results})
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,
     returnedStatus: 200,
    }
    return NextResponse.json(response, { status: 200})
  }
}