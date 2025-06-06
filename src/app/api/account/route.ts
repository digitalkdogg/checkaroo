'use server'
import { NextResponse} from 'next/server'
import pool from '@/common/db'
import {select} from '@/common/dbutils'
import { getDataFromCookie } from '@/common/common'
import { NextRequest } from 'next/server'
import {cookies} from 'next/headers'

import {v4 as uuidv4} from 'uuid'

export async function GET(request: NextRequest) {
 try {
    const query = {
      select: '*',
      from: 'User'
    }

    const rows = await select(query)

    let myuuid = uuidv4();

    return NextResponse.json({ users: myuuid });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

}

export async function POST() {

 try {

    const cookieStore = cookies()
    const cdata = (await cookieStore).get('sicher')
    const data = getDataFromCookie(cdata?.value)

    if (data == '') {
      return NextResponse.json({'data': ''})
    }

    const [rows] = await pool.query('SELECT * FROM Account where user_id = "' + data.user +'"');
    pool.end

    return NextResponse.json({ 'data': rows, 'split2': {data}})
 } catch(err) {
    return NextResponse.json({err})
 }

 return NextResponse.json({})
}