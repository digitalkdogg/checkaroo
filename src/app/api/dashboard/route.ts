import { NextResponse, NextRequest } from 'next/server'
import pool from '@/common/db';

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
    }

    get_query = 'select ' + query.select + ' from ' + query.from

    joinarr.forEach(item => {
        get_query = get_query + ' ' + item
    });

    get_query = get_query + ' where ' + query.where  
    const [results] = await pool.query(get_query);
    pool.end

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