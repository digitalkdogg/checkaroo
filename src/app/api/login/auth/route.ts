'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate, setExpireDT} from '@/common/common'
import {checkUserForActiveSession, doesSessionExists, validateUser, expireSession} from '@/common/session'
import { readCookie, writeCookie, deleteCookie } from '@/common/cookieServer'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'

export async function POST() {
    const cookieStr:any = await readCookie('sicher')
    const data = getDataFromCookie(decrypt(cookieStr))

    const user = data.user
    const password =crypto.MD5(data.pass).toString()

    if (data == '') {
        return NextResponse.json({'status': false, msg : 'The system can not process your request'})
    }

    if (await validateUser(user, password)) {

        const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
        const sessionCookie = await readCookie(cookiename)

        if (sessionCookie) {
            if (await doesSessionExists(data.user, sessionCookie)) {
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

                await writeCookie(cookiename, session, {
                    secure: true,
                    maxAge: 25200 // 7 hours});
                });

                const insquery = {
                    table: 'Logins',
                    fields: ['session_hash', 'user_id', 'LoginDT', 'ExpireDT'],
                    vals: [session, data.user, convertToMySQLDate(new Date()), setExpireDT()]
                }

                const login = await insert(insquery);
                await deleteCookie('sicher');

                return NextResponse.json({'status': 'success'})
            } else {
                expireSession(user);
                await deleteCookie('sicher');
                return NextResponse.json({'status': false, 'msg': 'Hmmmm we can not login in at this time.  Try clearing your cache and try again.'})
            }
        }
    } else { //end validate user true
        await deleteCookie('sicher');
        return NextResponse.json({'status': false, 'msg': 'Bad username and password.  Please try again'})
    } //end validate user false
}