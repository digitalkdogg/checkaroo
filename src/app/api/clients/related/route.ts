import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { decrypt } from '@/common/crypt'
import { writelog } from '@/common/logs'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

    if (!headersLegit(request, ['/clients'])) {
      return NextResponse.json({ err : {message: 'Unauthorized request' }}, { status: 401 });
    }
  
    const json = await request.json();
    const session:string = json.session;

    if (!session) {
        return NextResponse.json({ err: {message:'Unauthorized Session' }}, { status: 401 });
    }

    const accountid = await getAccountIDSession(session) 

    if (!accountid) {
      return NextResponse.json({ err: {message: 'Unauthorized Account' }}, { status: 401 });
    }

    const query = {
      select : '*',
      from : 'Transactions',
      where : 'Transactions.account_id = "' + accountid  + '" and Transactions.client_id = "' + decrypt(json.id) + '"' ,
      join : [
        'inner join Clients on Clients.client_id = Transactions.client_id',
        'inner join Category on Category.category_id = Transactions.category_id'
      ],
      sort: 'Transactions.client_id asc'
    }

    let arr:unknown = []
    const results = await select(query);
    arr = results;

    return NextResponse.json(arr)
}