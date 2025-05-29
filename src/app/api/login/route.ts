'use server'
import { NextResponse, NextRequest } from 'next/server'
import pool from '@/common/db'
import { getDataFromCookie } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt} from '@/common/crypt'

export async function POST() {
    try {

        const cookieStore = cookies()
        const cdata = (await cookieStore).get('sicher')
        const cookiestr = decrypt(cdata?.value);
        const data = getDataFromCookie(cookiestr)

        if (data == '') {
            return NextResponse.json({'data': ''})
        }

        const [rows] = await pool.query('SELECT * FROM Account where user_id = "' + data.user +'"');
        pool.end

        return NextResponse.json({ 'data': rows, 'split2': {data}})
    } catch(err) {

    }
}