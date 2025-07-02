import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import { headersLegit } from '@/common/session'

export async function GET(request: NextRequest) {

    return NextResponse.json({'results': {'err': {'message': 'Not Authorized'}}})
}

export async function POST(request: NextRequest) {

  try {

    if (!headersLegit(request, ['/'])) {
      return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }

    const json = await request.json();
    const session = await json.session;

    if (!session) {
      return NextResponse.json({'results': {'err': {'message' : 'Not Authorized'}}})
    }

    const accountid = await getAccountIDSession(session) 
  

    if (!accountid) {
      return NextResponse.json({'results': {'err': {'message' : 'Not Authorized'}}})
    }

    let joinarr = [
        'inner join Clients on Clients.client_id = Transactions.client_id',
        'inner join Category on Category.category_id = Transactions.category_id' 
    ];

    var query = {
      select : '*',
      from : 'Transactions',
      where : 'Transactions.account_id = "' + accountid  + '"',
      join: joinarr
    }

    const results = await select(query)

    return NextResponse.json({ results})
  } catch (err) {
    const response = {'results': {'err': {message : (err as Error).message}}}
    return NextResponse.json(response, { status: 200})
  }

}