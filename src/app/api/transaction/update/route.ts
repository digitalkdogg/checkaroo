import { NextResponse, NextRequest } from 'next/server'
import {select, update} from '@/common/dbutils'
import {getAccountIDSession, headersLegit} from '@/common/session'
import {decrypt} from '@/common/crypt'
import {v4 as uuidv4} from 'uuid'
import {writelog} from '@/common/logs'
import { convertToMySQLDate } from '@/common/common'
import {ResultSetHeader} from 'mysql2'


export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 }); 
}

export async function POST(request: NextRequest) {
  if (!headersLegit(request, ['/trans/dets'])) {
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
    transid: string,
    account_id: string,
    date:Date,
    clients: string,
    amount: string,
    categories:string
  }

  interface Client {
    client_id: number
  }

  interface Client2 {
    0 : []
  }

  interface Category {
    client_id: number
  }

  //interface Result {
  //  status: string
 // }

// interface Err {
//   err :{
//      message?: string,
//      code?: string,
//      errno?: number,
//      sql?: string , 
//      sqlState?: string,
//      sqlMessage?: string
//    }
// }

  interface Result {
    message?: string,
    err?: string,
    status?:string
  }

  interface Res {
    err? : {
      message?: string,
      code?: string,
      errno?: number,
      sql?: string , 
      sqlState?: string,
      sqlMessage?: string
    },
    data?: {data?: string}
  }


  const datastr:string = decrypt(json.data) ;
  const data:Data = JSON.parse(datastr);

  const date = convertToMySQLDate(data.date);
  const clients = data.clients;
  const amount = data.amount;
  const categories = data.categories; 
  const transid = data.transid;
 

  const clientid = await getClientID(clients);
  const categoryid = await getCatID(categories);

  if(!clientid || !categoryid) {
    return NextResponse.json({ error: {'message' : 'Client or Category not found' }}, { status: 444 });
  }

  const updatequery = {
    table: 'Transactions',
    fields : 'date="' + date + '", amount="' + amount + '", client_id="' + clientid + '", category_id="' + categoryid + '"',  
    where : 'account_id = "' + accountid + '" and trans_id="' + transid + '"'
  }

  
  try {
      const results:Result = await update(updatequery).then(async (res:Res) => {
        if (res.err) {
          throw new Error(res.err.message);
        } else if (res.data) {
          return {status: 'completed'}
        } else {
          throw new Error('Unknown error')
        }
    }).catch((err:Error) => {
      return {status: 'error', err: err.toString()}
    })

    if (results && results.status === 'completed') {
      return NextResponse.json({ status: 'success', transid: transid, message: 'Transaction updated successfully' });
    }  else if(results.err) {
      return NextResponse.json({ error: results.err }, { status: 500 });
    } else {
      return NextResponse.json({error : 'Update encountered an unknown error'}, {status: 500})
    }
   
  } catch (error) {
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
  }
}

async function getClientID(clientName: string) {
  interface Client {
    length?: number,
    client_id?: number
  }

  const query = {
    select: 'client_id',
    from: 'Clients',
    where: `company_name = "${clientName}"`
  }

  const rows = await select(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rowsarr:any = [];
  rowsarr = rows;

  if (rowsarr.length > 0) {
    return rowsarr[0].client_id;
  }
  return null; 
}

async function getCatID(catName: string) {
  const query = {
    select: 'category_id',
    from: 'Category',
    where: `category_name = "${catName}"`
  }

  const rows = await select(query);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rowsarr:any = [];
  
  rowsarr = rows;
  
  if (rowsarr.length > 0) {
    return rowsarr[0].category_id;
  }
  return null; // Example client ID
}