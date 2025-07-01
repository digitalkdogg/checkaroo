'use server'
import { NextRequest, NextResponse } from 'next/server'
import { insert} from '@/common/dbutils'
import { convertToMySQLDate, setExpireDT} from '@/common/common'
import {checkUserForActiveSession, doesSessionExists, validateUser, expireSession} from '@/common/session'
import { readCookie, writeCookie } from '@/common/cookieServer'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'
import moment from 'moment'
import { writelog } from '@/common/logs'

// @todo secure this api endpoint

export async function POST(request:NextRequest) {
    let referer = request.headers.get('referer');
    if (referer == null || referer == '') {
        return NextResponse.json({'status': false, msg : 'The system can not process your request'})
    } else {
        if (referer.indexOf('login') == -1) {
            return NextResponse.json({'status': false, msg : 'The system can not process your request'})
        }
    }

    const json = await request.json();
    if (!json.user || !json.pass) {
        return NextResponse.json({'status': false, msg : 'The reqired fields are not present'})
    }
    const user:string = decrypt(json.user);
    const pass:string = decrypt(json.pass);

    const password =crypto.MD5(pass).toString()

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
                for (let x=0; x<5; x++) {
                    if (session.length < 96) {
                        session = session + uuidv4().trim();
                    }
                }

                var sessionencrypted = ''
                sessionencrypted =  moment().format('SSS') + '|||' + session + '|||' + moment().format('SSS');
                sessionencrypted = encrypt(sessionencrypted)

                await writeCookie(cookiename, sessionencrypted, {
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