import { NextResponse, NextRequest } from 'next/server'
import {select, update} from '@/common/dbutils'
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

  interface Category {
    client_id: number
  }

  interface Result {
    status: string
  }


  const datastr:string = decrypt(json.data) ;
  const data:Data = JSON.parse(datastr);

  const date = data.date;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results:any = await update(updatequery).then(async () => {
        return{status: 'completed'}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err:any) => {
      writelog('Error update transaction 1: ' + err, 'Transaction');
      return {status: 'error', err: err.toString()}
    }).finally(() => {
        return {status: 'completed'};   
    })

    writelog(results, '------------------results line here ---------------------------')
    if (results && results.status === 'completed') {
      writelog('Transaction update successfully: ' + JSON.stringify(updatequery), '*********Transaction**********');
      return NextResponse.json({ status: 'success', transid: transid, message: 'Transaction updated successfully' });
    }  else {
      writelog('Error update transaction 2: ' + JSON.stringify(updatequery), '*********Transaction**********');
      return NextResponse.json({ error: 'Error update data 3' }, { status: 500 });
    }
   
  } catch (error) {
    process.stdout.write('Error upate data: ' + error + '\n');
    return NextResponse.json({ error: 'Error update data 3' }, { status: 500 });
  }
}

async function validateTransaction(transid: string, accountid: string) {
  const validateQuery = {
    select: '*',
    from: 'Transactions',
    where: `trans_id = "${transid}" AND account_id = "${accountid}"`
  } 

   const validateRows = await select(validateQuery);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let validateRowsArr:any = [];
      validateRowsArr = validateRows;
      writelog('validateRowsArr is ' + JSON.stringify(validateRowsArr), '------------Transaction-------');
      if (validateRowsArr.length > 0) {
        return true;
      }
      return false; 
}

async function getClientID(clientName: string) {
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
  return null; // Example client ID
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