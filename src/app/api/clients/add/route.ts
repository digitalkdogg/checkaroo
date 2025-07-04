import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'

export async function GET(request: NextRequest) {
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

      if (!headersLegit(request, ['trans/add', 'trans/dets', 'clients/add', 'clients/dets'])) {
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

   // var query = {
   //   select : '*',
   //   from : 'Clients',
   //   where : 'account_id = "' + accountid  + '"' ,
   // }

   //   var arr:any = []
   //   const results = await select(query);
  //    arr = results;

   //   if (arr.length == 0 ) {
   //     arr = ['no results found here']
   //   }

   //   return NextResponse.json(arr)
}