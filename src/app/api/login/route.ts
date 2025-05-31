'use server'
import { NextResponse, NextRequest } from 'next/server'
//import pool from '@/common/db'
import {select} from '@/common/dbutils'
import { getDataFromCookie, validatePassword, hashPassword } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt} from '@/common/crypt'
import crypto from 'crypto-js';


export async function POST() {
    try {
        
        const cookieStore = cookies()
        const cdata = (await cookieStore).get('sicher')
        const cookiestr = decrypt(cdata?.value);
        const data = getDataFromCookie(cookiestr)

        if (data == '') {
            return NextResponse.json({'data': ''})
        }

      
        const user = data.user
        const password = crypto.MD5(data.pass).toString()
        const query = {
            select: '*',
            from: 'User',
            where: 'user_id = "' + user + '" and password_hash = "' + password + '"' 
        }

        const rows = await select(query)
        // const [rows] = await pool.query('SELECT * FROM User where user_id = "' + user +'" and password_hash = "' + password + '"');
      //  pool.end

        return NextResponse.json({ 'data': rows})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}