import { NextResponse, NextRequest } from 'next/server'
import {select, insert} from '@/common/dbutils'
import {getAccountIDSession, headersLegit} from '@/common/session'
import {decrypt} from '@/common/crypt'
import {v4 as uuidv4} from 'uuid'
import {writelog} from '@/common/logs'
import { convertToMySQLDate } from '@/common/common'


export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
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

  interface Data {
    company:string
  } 


  interface Error {
    message: string
  }



  const datastr:string = decrypt(json.data) ;
  const data:Data = JSON.parse(datastr);

  const company = data.company;
  if (!company) {
    return NextResponse.json({error: {'message': 'Company Not found'}}, {status:444})
  }

   interface Trans {
    categoryid: string
  }

  const transaction = {
    select: 'category_id',
    from: 'Transactions',
    where: 'client_id = ? AND account_id = ?',
    whereVals: [company, accountid],
    limit:1
  }

  try {
    const category_id = await select(transaction) as Trans[];

    if (category_id) {
        return NextResponse.json({ status: 'success', category_id: category_id }, { status: 200 });
    } else {
        return NextResponse.json({ 'status': 'nocatfound' }, { status: 200 });
    }
  }
    catch(error) {
          return NextResponse.json({ 'status': 'error', 'error': error }, { status: 200 });
    }
}