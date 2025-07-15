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

  interface CategoryRow {
    category_id: string
    category_name: string
    account_id: string
  }

  if (!headersLegit(request, ['trans/add', 'trans/dets', 'categories/add', 'categories/dets'])) {
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

  if (!data || !data.catname || !data.catid) {
    return NextResponse.json({ error: 'Invalid category data' }, { status: 400 })
  }

  try {
    const existing:CategoryRow[] = await select({
      select: '*',
      from: 'Category',
      where: `account_id = "${accountid}" AND category_name = "${data.catname}"`
    }) as CategoryRow[]

    const matchcheck = (match:string, data:string) => {
        if(match == data) {return true;} else {return false;}
    }

    if (existing?.[0]) {
      const match = existing[0]
      if (matchcheck(match.category_id, data.catid)) {
          return NextResponse.json({ status: true, message: 'Category Update Successful' })
      }
      return NextResponse.json({ message: 'Category already exists' }, { status: 444 })
    }

    const updateResult = await update({
      table: 'Category',
      fields: `category_name="${data.catname}"`,
      where: `account_id = "${accountid}" AND category_id = "${data.catid}"`,
      limit: 1
    })

    const success = !!updateResult
    return NextResponse.json({
      status: success,
      message: success ? 'Category Update Successful' : 'Error Update Category'
    })

  } catch (err) {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
