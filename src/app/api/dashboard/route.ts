import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'

export async function GET(request: NextRequest) {
  try {

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
      join: joinarr
    }

    const results = await select(query)

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