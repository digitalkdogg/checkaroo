import { NextResponse, NextRequest } from 'next/server'
import {select, update} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'
import { decrypt } from '@/common/crypt'

export async function GET(request: NextRequest) {
    writelog(request.toString(), '----------invalid request get----------' )
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

  interface ClientRow {
    client_id: string
    company_name: string
    account_id: string
  }

  if (!headersLegit(request, ['trans/add', 'trans/dets', 'clients/add', 'clients/dets'])) {
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
    return NextResponse.json({ error: 'Invalid encrypted data' }, { status: 400 })
  }

  writelog(data, 'client update here')
  if (!data || !data.clientname || !data.clientid) {
    return NextResponse.json({ error: 'Invalid client data' }, { status: 400 })
  }

  try {
    const existing:ClientRow[] = await select({
      select: '*',
      from: 'Clients',
      where: `account_id = "${accountid}" AND company_name = "${data.clientname}"`
    }) as ClientRow[]

    const matchcheck = (match:string, data:string) => {
        if(match == data) {return true;} else {return false;}
    }

    if (existing?.[0]) {
      const match = existing[0]
      if (matchcheck(match.client_id, data.clientid)) {
          return NextResponse.json({ status: 'success', message: 'Client Update Successful' })
      }
      return NextResponse.json({ message: 'Client already exists' }, { status: 444 })
    }

    const updateResult = await update({
      table: 'Clients',
      fields: `company_name="${data.clientname}"`,
      where: `account_id = "${accountid}" AND client_id = "${data.clientid}"`,
      limit: 1
    })

    const success = !!updateResult
    return NextResponse.json({
      status: success? 'success': 'error',
      message: success ? 'Client Update Successful' : 'Error Update Client'
    })

  } catch (err) {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
