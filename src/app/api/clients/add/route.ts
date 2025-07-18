import { NextResponse, NextRequest } from 'next/server'
import {select, insert} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { decrypt } from '@/common/crypt'
import { writelog } from '@/common/logs'

interface Clients {
  client_id: number
  company_name: string
  account_id: number
}

export async function GET(request: NextRequest) {
    writelog(request.toString(), '----------invalid request get-----------')
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

    if (!headersLegit(request, ['trans/add', 'trans/dets', 'clients/add', 'clients/dets'])) {
      return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }
  
    interface Err {
      message?:string
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

    const data = JSON.parse(decrypt(json.data));
    if (!data.ClientName) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const validateRows = await validateClient(data.ClientName, accountid);
    if (validateRows) {
        return NextResponse.json({ error: 'Client already exists' }, { status: 400 });
    }

    const insquery = {
        table: 'Clients',
        fields: ['company_name', 'account_id'],
        vals: [data.ClientName.trim(), accountid]
      }
      
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results:any = await insert(insquery).then(async () => {
          const validateRows = await validateClient(data.ClientName, accountid);
          if (await validateRows) {
            return {status: 'completed'};
          } else return {status: 'failed'}
        }).catch((err:Err) => {

          return NextResponse.json({ error: 'Error inserting client', msg: err.toString() }, { status: 500 });
        })
    
        if (results && results.status === 'completed') {
          return NextResponse.json({ status: 'success', message: 'client added successfully' });
        }  else {
          return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
        }

      } catch (error) {
        process.stdout.write('Error inserting data: ' + error + '\n');
        return NextResponse.json({ error: 'Error inserting data here' }, { status: 500 });
      }

}

async function validateClient(value: string, accountid: string) {
  const validateQuery = {
    select: '*',
    from: 'Clients',
    where: `company_name = "${value}" AND account_id = "${accountid}"`
  } 

  const validateRows = await select(validateQuery) as Clients[];

    if (validateRows.length > 0) {
      return true;
    }
    return false; 
}
