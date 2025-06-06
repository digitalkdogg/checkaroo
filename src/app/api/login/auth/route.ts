'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate, setExpireDT, doesSessionExists, validateUser, checkUserForActiveSession} from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'

export async function POST() {
    const cookieStore = cookies()
    const cdata = (await cookieStore).get('sicher')
    const cookiestr = decrypt(cdata?.value);
    const data = getDataFromCookie(cookiestr)

    if (data == '') {
        return NextResponse.json({'status': false, msg : 'The system can not process your request'})
    }

    const sessionCookie = (await cookieStore).get('nothinedetrahamte')

    if (sessionCookie) {
        return NextResponse.json({'status': 'success', 'msg': 'session already exists'})
    }

    const user = data.user
    const password = crypto.MD5(data.pass).toString()
    const session = encrypt(uuidv4());
    const sessionArray = await doesSessionExists(session, user)     

    if (sessionArray) {
        return NextResponse.json({'status': 'success', 'msg': 'session id already exists'})
    }

    if (await checkUserForActiveSession(user) == false) {

        if (await validateUser(user, password)) {
            //I am good

            (await cookies()).set('nothinedetrahamte', session, {
                secure:true,
                sameSite: true,
                maxAge: 60 * 60 * 12,
            })

            const insquery = {
                table: 'Logins',
                fields: ['session_hash', 'user_id', 'LoginDT', 'ExpireDT'],
                vals: [session, data.user, convertToMySQLDate(new Date()), setExpireDT()]
            }

            const login = await insert(insquery);
            return NextResponse.json({'status': 'success'})
        } else {
            // I am not so good.
            return NextResponse.json({'status': false, 'msg' : 'The username and password is incorrect'})
        }
    } else {
        return NextResponse.json({'status': 'success'})
    }


    return NextResponse.json({'status': false, 'msg': 'The system can not log in at this time'})
}