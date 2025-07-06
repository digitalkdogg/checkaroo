import { NextResponse, NextRequest } from 'next/server'
import {select} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { update } from '@/common/dbutils'
import { writelog } from '@/common/logs'
import { OkPacketParams } from 'mysql2'

export async function GET(request: NextRequest) {
    writelog(request.toString(), '---------invalide request get-------------')
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

      if (!headersLegit(request, ['trans/add', 'trans/dets'])) {
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

    if (!json.data) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const data = JSON.parse(json.data);
    if (!data.value) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const query = {
      select: 'balance',
      from : 'Account',
      where : 'account_id = "' + accountid + '"',
      limit: '1'
    }


    const oldbalance:object = await select(query);

    let newbalance:number = 0
    Object.entries(oldbalance).map(([key, value]) => (
       newbalance = parseFloat(value.balance) - parseFloat(data.value)
    ))

    const updatequery = {
        table : 'Account',
        fields : 'balance = "' +newbalance + '"',
        where : 'account_id = "' + accountid + '"',
        limit: '1'
      }

    try {
     
      const balance = await update(updatequery);
      return NextResponse.json({status: 'success', balance: data.value})
    } catch (e) {
      return NextResponse.json({status: 'error', error: e})
    }
   // const insquery = {
   //     table: 'Account',
   //     fields: ['category_name', 'account_id'],
   //     vals: [data.value.trim(), accountid]
   //   }
      
   // try {
   //     const results:any = await insert(insquery).then(async (res:any) => {
   //       const validateRows = await validateCategory(data.value, accountid);
   //       if (await validateRows) {
   //         return {status: 'completed'};
   //       } else return {status: 'failed'}
    
   //     }).catch((err:any) => {

   //       return NextResponse.json({ error: 'Error inserting category' }, { status: 500 });
   //     })
    
   //     if (results && results.status === 'completed') {
   //       return NextResponse.json({ status: 'success', message: 'category added successfully' });
   //     }  else {
   //       return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
   //     }

   //   } catch (error) {
   //     process.stdout.write('Error inserting data: ' + error + '\n');
   //     return NextResponse.json({ error: 'Error inserting data here' }, { status: 500 });
   ///   }

}

async function validateCategory(value: string, accountid: string) {
  const validateQuery = {
    select: '*',
    from: 'Category',
    where: `category_name = "${value}" AND account_id = "${accountid}"`
  } 

   const validateRows = await select(validateQuery);
      var validateRowsArr:any = [];
      validateRowsArr = validateRows;

      if (validateRowsArr.length > 0) {
        return true;
      }
      return false; 
}
