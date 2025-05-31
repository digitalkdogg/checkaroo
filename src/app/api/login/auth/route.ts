'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import { promises } from 'dns'


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

        var rowsarr:any = []
        const rows = await select(query)
         rowsarr=rows
        

        if (rowsarr.length>0) {
            const session = encrypt(process.env.NEXT_PUBLIC_APP_crypt + data.user + process.env.NEXT_PUBLIC_App_readable)

            const insquery = {
                table: 'Logins',
                fields: ['session_hash', 'user_id', 'loginDT'],
                vals: [session, data.user, convertToMySQLDate(new Date())]
            }

            const login = insert(insquery);
  
             (await cookies()).set('nothinedetrahamte', encrypt(session), {
                secure:true,
                httpOnly: true,
                sameSite: true,
                maxAge: 60 * 60 * 12,
            })

        }


        return NextResponse.json({ 'data': rows, 'rows':rowsarr.length})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}