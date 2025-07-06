import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {decrypt} from '@/common/crypt'
import { headersLegit } from '@/common/session'
import {writelog} from '@/common/logs'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 }); 
}

export async function POST(request: NextRequest) {
    if (!headersLegit(request, ['/trans/dets'])) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }
    const json = await request.json();
    const transid = decrypt(json.transid);
    const session = json.session

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    } 

    const accountid = await getAccountIDSession(session) 

    if (!accountid) {
      return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
    }

    if (transid) {

      const joinarr = [
        'inner join Clients on Clients.client_id = Transactions.client_id',
        'inner join Category on Category.category_id = Transactions.category_id' 
      ];

      const query = {
        select : '*',
        from : 'Transactions',
        where : 'Transactions.account_id = "' + accountid + '" and trans_id = "' + transid + '"' ,
        join: joinarr,
        limit: 1
      }

        let arr:any = []
        const results = await select(query);
        arr  = results
        if (arr.length == 0 ) {
          arr = ['no results found here']
        }

        return NextResponse.json(arr[0])
    } else {
        return NextResponse.json([{'error' : 'No transid'}])
    }
}