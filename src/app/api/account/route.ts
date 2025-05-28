'use server'
import { NextResponse, NextRequest } from 'next/server'
import pool from '@/common/db'

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
  var split1 = cdata?.value.split('||')
  var split2:any = []
  if (split1 != undefined) {
    split2 = split1[0].split(':')
  }

  


  const [rows] = await pool.query('SELECT * FROM Account where user_id = "' + split2[1] +'"');

  return NextResponse.json({ 'data': rows})
 } catch(err) {
  return NextResponse.json({err})
 }

 return NextResponse.json({})
}