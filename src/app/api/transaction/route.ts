import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import SessionCheck from '@/app/components/SessionCheck'

export async function GET(request: NextRequest) {

    const session = await SessionCheck();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let transid = decodeURIComponent(request.nextUrl!.searchParams!.get('transid')!);

    if (transid) {
      let get_query = ''

      const accountid='1'

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