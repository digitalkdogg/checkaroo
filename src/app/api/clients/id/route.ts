import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'
import { decrypt } from '@/common/crypt'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

    interface Clients {
      client_id: number
      account_id: number
      company_name : string
    }

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

    const query = {
      select : '*',
      from : 'Clients',
      where : 'account_id = "' + accountid  + '" and client_id = "' + decrypt(json.id) + '"',
    }

    try {
      const results = (await select(query)) as Clients[]
      const response: Clients[] | string[] = 
        results.length ===0 ? ['no results found here'] : results

      return NextResponse.json(response)
    } catch(err:unknown) {
      return NextResponse.json(err)
    }
}