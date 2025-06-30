'use server'
import { NextRequest, NextResponse } from 'next/server'
import { insert} from '@/common/dbutils'
import { convertToMySQLDate, setExpireDT} from '@/common/common'
import {checkUserForActiveSession, doesSessionExists, validateUser, expireSession} from '@/common/session'
import { readCookie, writeCookie, deleteCookie } from '@/common/cookieServer'
import {decrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'
import { writelog } from '@/common/logs'

// @todo secure this api endpoint

export async function POST(request:NextRequest) {

    const json = await request.json();
    const user:string = decrypt(json.user);
    const pass:string = decrypt(json.pass);

    const password =crypto.MD5(pass).toString()

    if (user =='' || password == '') {
        return NextResponse.json({'status': false, msg : 'The system can not process your request'})
    }

    if (await validateUser(user, password)) {

        const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
        const sessionCookie = await readCookie(cookiename)

        if (sessionCookie) {
            if (await doesSessionExists(user, sessionCookie)) {
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
                    vals: [session, user, convertToMySQLDate(new Date()), setExpireDT()]
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