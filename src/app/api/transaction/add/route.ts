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
    date:Date,
    clients: string,
    amount: string,
    categories:string
  }

  interface Error {
    message: string
  }

  const datastr:string = decrypt(json.data) ;
  const data:Data = JSON.parse(datastr);

  const date = data.date;
  const clients = data.clients;
  const amount = data.amount;
  const categories = data.categories; 
  const transid = uuidv4().trim().substring(0, 20).replace(/-/g, '');

  const clientid = await getClientID(clients);
  const categoryid = await getCatID(categories);

  if(!clientid || !categoryid) {
    return NextResponse.json({ error: {'message' : 'Client or Category not found' }}, { status: 444 });
  }

  const insquery = {
    table: 'Transactions',
    fields: ['trans_id', 'account_id', 'date', 'amount', 'client_id', 'category_id', 'lastmodified'],
    vals: [transid, accountid, convertToMySQLDate(date), amount, clientid, categoryid, convertToMySQLDate(new Date())]
  }
  
  try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results:any = await insert(insquery).then(async () => {
      const validateRows = await validateTransaction(transid, accountid);

      if (await validateRows) {
          return {status: 'completed'};
        
      } else return {status: 'failed'}
    }).catch((err:Error) => {
      writelog('Error inserting transaction: ' + err, 'Transaction');
      return NextResponse.json({ error: 'Error inserting transaction', msg:err.toString() }, { status: 500 });
    })

    if (results && results.status === 'completed') {
      writelog('Transaction added successfully: ' + JSON.stringify(insquery), '*********Transaction**********');
      return NextResponse.json({ status: 'success', transid: transid, amount: amount ,message: 'Transaction added successfully' });
    }  else {
      writelog('Error inserting transaction: ' + JSON.stringify(insquery), '*********Transaction**********');
      return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
   
  } catch (error) {
    process.stdout.write('Error inserting data: ' + error + '\n');
    return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
  }
}

async function validateTransaction(transid: string, accountid: string) {
  interface Trans {
    transid: string
  }

  const validateQuery = {
    select: '*',
    from: 'Transactions',
    where: `trans_id = "${transid}" AND account_id = "${accountid}"`
  } 

   const validateRows = await select(validateQuery) as Trans[];
      writelog('validateRowsArr is ' + JSON.stringify(validateRows), '------------Transaction-------');
      if (validateRows.length > 0) {
        return true;
      }
      return false; 
}

async function getClientID(clientName: string) {
  interface Clients {
    client_id: string
  }

  const query = {
    select: 'client_id',
    from: 'Clients',
    where: `company_name = "${clientName}"`
  }

  const rows = await select(query) as Clients[];

  
  if (rows.length > 0) {
    return rows[0].client_id;
  }
  return null; 
}

async function getCatID(catName: string) {

  const query = {
    select: 'category_id',
    from: 'Category',
    where: `category_name = "${catName}"`
  }

  const catrows = await select(query);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rowsarr:any = [];
  rowsarr = catrows;
  
  if (rowsarr.length > 0) {
    return rowsarr[0].category_id;
  }
  return null;
}