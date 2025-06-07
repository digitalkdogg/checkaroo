'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate, setExpireDT} from '@/common/common'
import {checkUserForActiveSession, doesSessionExists, validateUser, expireSession} from '@/common/session'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'

export async function POST() {
    const cookieStore = cookies()
    const cdata = (await cookieStore).get('sicher')
    const cookiestr = decrypt(cdata?.value);
    const data = getDataFromCookie(cookiestr)

    const user = data.user
    const password =crypto.MD5(data.pass).toString()

    if (data == '') {
        return NextResponse.json({'status': false, msg : 'The system can not process your request'})
    }

    if (await validateUser(user, password)) {

        const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
        const sessionCookie = (await cookieStore).get(cookiename)

        if (sessionCookie) {
            if (await doesSessionExists(data.user, sessionCookie.value)) {
                return NextResponse.json({'status': 'success', 'msg': 'Session is valid already'})
            } else {
                return NextResponse.json({'status': false, 'msg': 'We can not login in at this time.  Try clearing your cache and try again.'})
            }
        } else {
            if (await checkUserForActiveSession(user) == false) {
                var session = uuidv4().trim() + uuidv4().trim();

                if (session.length < 90) {
                    session = session + uuidv4().trim();
                }

                (await cookies()).set(cookiename, session, {
                    secure:true,
                    // sameSite: true,
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
                expireSession(user);
                return NextResponse.json({'status': false, 'msg': 'Hmmmm we can not login in at this time.  Try clearing your cache and try again.'})
            }
        }
    } else { //end validate user true

        return NextResponse.json({'status': false, 'msg': 'Bad username and password.  Please try again'})
    } //end validate user false
}