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
      if (!headersLegit(request, ['categories/dets'])) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
      }

      const json = await request.json();
      const session:string = json.session;

      interface Cat {
        category_id: number,
        category_name: string,
        account_id: number
      }
  
      if (!session) {
          return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
      }
      
      const accountid = await getAccountIDSession(session) 
  
      if (!accountid) {
        return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
      }
      if (json.id) {
        const query = {
          select : '*',
          from : 'Category',
          where : 'account_id = "' + accountid  + '" and category_id = "' + decrypt(json.id) + '"',
        }

        const results = await select(query);
        let arr: Cat[] = Array.isArray(results) ? results as Cat[] : [];
        if (arr.length === 0) {
          return NextResponse.json({ error: 'No Results Found' })
        } 
        return NextResponse.json(arr[0])

    } else {
        return NextResponse.json([{'error' : 'No catid'}])
    }
}