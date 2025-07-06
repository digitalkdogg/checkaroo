import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

      if (!headersLegit(request, ['clients/dets'])) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
      }
  

    const json = await request.json();
    const session:string = json.session;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const accountid = await getAccountIDSession(session) 

    if (!accountid) {
      return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
    }

    var query = {
      select : '*',
      from : 'Clients',
      where : 'account_id = "' + accountid  + '" and client_id = "' + json.id + '"',
    }

      var arr:any = []
      const results = await select(query);
      arr = results;

      if (arr.length == 0 ) {
        arr = ['no results found here']
      }

      return NextResponse.json(arr)
}