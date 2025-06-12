import { NextResponse, NextRequest } from 'next/server'
import {cookies} from 'next/headers'
import pool from '@/common/db';
import {select} from '@/common/dbutils'
import {decrypt, encrypt} from '@/common/crypt'
import { getDataFromCookie} from '@/common/common'
import {doesSessionExists} from '@/common/session'

export async function GET(request: NextRequest) {

    try {
        let get_query = ''
        let transid = request.nextUrl!.searchParams!.get('transid')!;

        var qry = {
          select : '*',
          from : 'Transactions',
          where: ''
        }

        if (transid) {
             qry.where = 'account_id = "1" && trans_id = "' + transid + '"' 
        } else {
             qry.where = 'account_id = "1"'
        }

        get_query = 'select ' + qry.select + ' from ' + qry.from

        if (qry.where != '') {
            get_query = get_query + ' where ' +qry.where
        }

        const [results] = await pool.query(get_query)
        pool.end

        return NextResponse.json({results})
  
  } catch (err) {

    const response = {
      error: (err as Error).message,
     returnedStatus: 401,
    }
    return NextResponse.json(response, { status: 401 })
 }
}

export async function POST(request:NextRequest) {
  const cookieStore = cookies()
  const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
  const sessionCookie = (await cookieStore).get(cookiename)

  if (sessionCookie) {
     // if (await doesSessionExists(data.user, sessionCookie.value)) {
     //     return NextResponse.json({'status': 'success', 'msg': 'Session is valid already'})
     // } else {
     //     return NextResponse.json({'status': false, 'msg': 'We can not login in at this time.  Try clearing your cache and try again.'})
     // }
    const cdata = (await cookieStore).get('sicher')
    const cookiestr = decrypt(cdata?.value);
    const data = getDataFromCookie(cookiestr)


    const query = {
      select : '*',
      from : 'Transactions', 
      where: 'trans_Id = "' + data.trans_id + '"',
      limit: 1
    }

    try {
      const response = await select(query);
      return NextResponse.json({response})
    } catch (e) {
      return NextResponse.json({e})
    }
    return 
  }
}