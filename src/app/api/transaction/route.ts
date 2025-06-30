import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {decrypt} from '@/common/crypt'
import {writelog} from '@/common/logs'

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 }); 
}

export async function POST(request: NextRequest) {
    const json = await request.json();
    const transid = decrypt(json.transid);
    const sessionstr:string = decrypt(json.session);

    var session
    if (sessionstr.indexOf('|||')>0) {
      session = sessionstr.split('|||')[0]
    }

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    } 

    const accountid = await getAccountIDSession(session) 

    if (!accountid) {
      return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
    }

    if (transid) {

      let joinarr = [
        'inner join Clients on Clients.client_id = Transactions.client_id',
        'inner join Category on Category.category_id = Transactions.category_id' 
      ];

      var query = {
        select : '*',
        from : 'Transactions',
        where : 'Transactions.account_id = "' + accountid + '" and trans_id = "' + transid + '"' ,
        join: joinarr,
        limit: 1
      }

        var arr:any = []
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