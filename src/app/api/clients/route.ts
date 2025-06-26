import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import SessionCheck from '@/app/components/SessionCheck'


export async function GET(request: NextRequest) {

    const session = await SessionCheck();
    if (!session) {
        return NextResponse.json({'results': { 'err': 'Unauthorized' }}, { status: 200 });
    }

    let get_query = ''

    const accountid='1'

    var query = {
      select : '*',
      from : 'Clients',
      where : 'account_id = "' + accountid  + '"' ,
    }

      var arr:any = []
      const results = await select(query);
      arr = results;

      if (arr.length == 0 ) {
        arr = ['no results found here']
      }

      return NextResponse.json(arr)
}