import { NextResponse, NextRequest } from 'next/server'
import {select, update} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'
import { decrypt } from '@/common/crypt'
import { convertToMySQLDate } from '@/common/common'

export async function GET(request: NextRequest) {
    writelog(request.toString(), '----------invalid request get----------' )
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

  if (!headersLegit(request, ['trans/dets'])) {
    writelog(request.toString(), '----------invalid request get-----------')
    return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })
  }

  const json = await request.json()
  const { session, data: encryptedData } = json

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 })
  }

  const accountid = await getAccountIDSession(session)

  if (!accountid) {
    return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 })
  }

  let data
  try {
    data = JSON.parse(decrypt(encryptedData))
  } catch (err) {
    if (err) {
      return NextResponse.json({ error: 'Invalid encrypted data' }, { status: 400 })
    }
  }

  writelog(data, 'trans update is here')
  if (!data || !data.transid || !data.date || !data.amount || !data.clients || !data.categories) {
    return NextResponse.json({ error: 'Invalid trans data' }, { status: 400 })
  }

  try {  
    const clientid = await getClientID(data.clients);
    const categoryid = await getCatID(data.categories);

      const updateResult = await update({
        table: 'Transactions',
        fields : 'date="' +  convertToMySQLDate(data.date) + '", amount="' + data.amount + '", client_id="' + clientid + '", category_id="' + categoryid + '", lastmodified="' + convertToMySQLDate(new Date()) + '"',  
        where : 'account_id = "' + accountid + '" and trans_id="' + data.transid + '"'
    });

    const success = !!updateResult
    return NextResponse.json({
      status: success? 'success': 'error',
      message: success ? 'Transaction Update Successful' : 'Error Update Transaction'
    })

  } catch (err) {
    if (err) {
      return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
    }
  }

  async function getClientID(clientName: string) {

    const query = {
      select: 'client_id',
      from: 'Clients',
      where: `company_name = "${clientName}"`
    }

    const rows = await select(query);

    let rowsarr: unknown[] = [];
    if (Array.isArray(rows)) {
      rowsarr = rows;
    }

    if (rowsarr.length > 0) {
      return (rowsarr[0] as { client_id: number }).client_id;
    }
    return []; 
  }

  async function getCatID(catName: string) {
    const query = {
      select: 'category_id',
      from: 'Category',
      where: `category_name = "${catName}"`
    }

    const rows = await select(query);
    let rowsarr:unknown = [];
    
    rowsarr = rows;
    
    if (Array.isArray(rowsarr) && rowsarr.length > 0) {
      return rowsarr[0].category_id;
    }
    return null;
  }

}
