import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '-----invalid requests get --------')
  return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {
      if (!headersLegit(request, ['/'])) {
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

      const query = {
        select : 'balance',
        from : 'Account',
        where : 'account_id = "' + accountid  + '"'
      }

        let arr:object = {}
        const results = await select(query);
        arr = results

        return NextResponse.json(arr)
}