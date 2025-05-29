'use server'
import { NextResponse, NextRequest } from 'next/server'
import pool from '@/common/db'
import { getDataFromCookie, validatePassword, hashPassword } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt} from '@/common/crypt'
import crypto from 'crypto'


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
        const password = data.password
        const passwordhash = hashPassword(password)//crypto.hash('md5',data.password)

        const [rows] = await pool.query('SELECT * FROM User where user_id = "' + user +'" and password_hash = "' + passwordhash + '"');
        pool.end

        return NextResponse.json({ 'data': rows})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}