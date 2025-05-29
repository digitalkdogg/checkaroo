'use server'
import { NextResponse, NextRequest } from 'next/server'
import pool from '@/common/db'
import { getDataFromCookie } from '@/common/common'

import {cookies} from 'next/headers'

export async function GET(request: NextRequest) {
 try {

    const [rows] = await pool.query('SELECT * FROM User');
    return NextResponse.json({ users: rows });
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