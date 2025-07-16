import { NextResponse, NextRequest } from 'next/server'
import {select, insert} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { decrypt } from '@/common/crypt'
import { writelog } from '@/common/logs'

export async function GET(request: NextRequest) {
    writelog(request.toString(), '----------invalid request get----------' )
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

    if (!headersLegit(request, ['trans/add', 'trans/dets', 'categories/add', 'categories/dets'])) {
      writelog(request.toString(), '----------invalid request get-----------')
      return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }

    interface Err {
      message?: string
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

    const datastr = decrypt(json.data);
    const data = JSON.parse(datastr);

    if (!data.CategoryName) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const validateRows = await validateCategory(data.CategoryName, accountid);
    if (validateRows) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    writelog('kevin bollman was here');

    const insquery = {
        table: 'Category',
        fields: ['category_name', 'account_id'],
        vals: [data.CategoryName.trim(), accountid]
      }
      
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
     //   const results:any = await insert(insquery).then(async () => {
     //     const validateRows = await validateCategory(data.value, accountid);
     //     if (await validateRows) {
     //       return {status: 'completed'};
     //     } else return {status: 'failed'}
     //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
     //   }).catch((err:Err) => {

     //     return NextResponse.json({ error: 'Error inserting category', msg: err.toString()}, { status: 500 });
     //   })
    
     //   if (results && results.status === 'completed') {
     //     return NextResponse.json({ status: 'success', message: 'category added successfully' });
     //   }  else {
     //     return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
     //   }

      } catch (error) {
        process.stdout.write('Error inserting data: ' + error + '\n');
        return NextResponse.json({ error: 'Error inserting data here' }, { status: 500 });
      }

      return NextResponse.json({'testing':'test'})
}

async function validateCategory(value: string, accountid: string): Promise<boolean> {
  interface CategoryRow {
    id: string;
    category_name: string;
    account_id: string;
  }

  const validateQuery = {
    select: '*',
    from: 'Category',
    where: `category_name = "${value}" AND account_id = "${accountid}"`
  } 

  const validateRows = await select(validateQuery) as CategoryRow[];
  return validateRows.length>0;
}
