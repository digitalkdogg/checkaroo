'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate, setExpireDT, checkActiveSession } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';



export async function POST() {
    try {
        var rows
        const cookieStore = cookies()
        const cdata = (await cookieStore).get('sicher')
        const cookiestr = decrypt(cdata?.value);
        const data = getDataFromCookie(cookiestr)

        if (data == '') {
            return NextResponse.json({'data': ''})
        }

        const expire = setExpireDT()
        const activeSession = await checkActiveSession(data.user)

     //   if (activeSession == false) { 
    

            const user = data.user
            const password = crypto.MD5(data.pass).toString()
 
            const query = {
                select: '*',
                from: 'User',
                where: 'user_id = "' + user + '" and password_hash = "' + password + '"' 
            }

            var rowsarr:any = []
            rows = await select(query)
            rowsarr=rows
            
            if (rowsarr.length>0) {

                const crypt = process.env.NEXT_PUBLIC_APP_crypt;
                if (crypt) {
                const session = encrypt(crypt?.split('').reverse().join(''))
                    var expireDT = setExpireDT();
                    const insquery = {
                        table: 'Logins',
                        fields: ['session_hash', 'user_id', 'LoginDT', 'ExpireDT'],
                        vals: [session, data.user, convertToMySQLDate(new Date()), expireDT.format('Y-MM-DD HH:mm:ss')]
                    }

                    const login = insert(insquery);
        
                    (await cookies()).set('nothinedetrahamte', session, {
                        secure:true,
                        //httpOnly: true,
                        sameSite: true,
                        maxAge: 60 * 60 * 12,
                    })
                }
         //   }

        }// else {
            //const rows = []
          //  rows = ['activeSession'];
         // return NextResponse.json({'rows': ['activeSession']})
       // }


        return NextResponse.json({ 'data': rows, 'session': rowsarr})
    } catch(err) {
        return NextResponse.json({'error': err, 'test':'testing' })
    }
}