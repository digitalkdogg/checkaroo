import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession, headersLegit} from '@/common/session'
import {decrypt} from '@/common/crypt'
import {writelog} from '@/common/logs'
import { write } from 'fs'

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 }); 
}

export async function POST(request: NextRequest) {
    if (!headersLegit(request, ['/trans/add'])) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }
    
    const json = await request.json();
    const session = json.session

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    } 

    const accountid = await getAccountIDSession(session) 
    if (!accountid) {
      return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
    }

    if (decrypt(json.data) == 'undefined') {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    var data:any = decrypt(json.data);
    data = JSON.parse(data);

    const date = data.date;
    const company = data.company;
    const amount = data.amount;
    const category = data.category; 
    
    writelog( 'transid is ' +  data.date + ' and session is ' + session, '------------------transid is here------------------')


   // if (transid) {

   //   let joinarr = [
   //     'inner join Clients on Clients.client_id = Transactions.client_id',
   //     'inner join Category on Category.category_id = Transactions.category_id' 
   //   ];

   //   var query = {
   //     select : '*',
   //     from : 'Transactions',
   //     where : 'Transactions.account_id = "' + accountid + '" and trans_id = "' + transid + '"' ,
   //     join: joinarr,
   //     limit: 1
   //   }

    //    var arr:any = []
    //    const results = await select(query);
    //    arr  = results
    //    if (arr.length == 0 ) {
   //       arr = ['no results found here']
   //     }

    //    return NextResponse.json(arr[0])
    //} else {
     //   return NextResponse.json([{'error' : 'No transid'}])
   // }

   return NextResponse.json({ error: 'This API is not implemented yet' }, { status: 501 });
}