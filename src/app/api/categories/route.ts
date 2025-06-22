import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'


export async function GET(request: NextRequest) {
      
    let transid = decodeURIComponent(request.nextUrl!.searchParams!.get('transid')!);


    if (transid) {
      let get_query = ''

      const accountid='1'

      var query = {
        select : '*',
        from : 'Category',
        where : 'account_id = "' + accountid  + '"' ,
      }

        var arr:any = []
        const results = await select(query);
        arr = results;

        if (arr.length == 0 ) {
          arr = ['no results found here']
        }

        return NextResponse.json(arr)
    } else {
        return NextResponse.json([{'error' : 'No transid'}])
    }
}