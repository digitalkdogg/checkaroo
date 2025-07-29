'use server'
import { NextRequest, NextResponse } from 'next/server'
import { insert} from '@/common/dbutils'
import { convertToMySQLDate, setExpireDT} from '@/common/common'
import {checkUserForActiveSession, doesSessionExists, validateUser, expireSession, headersLegit, findSession} from '@/common/session'
import { readCookie, writeCookie } from '@/common/cookieServer'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';
import {v4 as uuidv4} from 'uuid'
import moment from 'moment'
import { writelog } from '@/common/logs'

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
   return NextResponse.json({'results': {'err': {'message': 'Not Authorized'}}})
}

export async function POST(request:NextRequest) {
    if (!headersLegit(request, ['login'])) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }

    const json = await request.json();
    const data = JSON.parse(decrypt(json.data));
    if (!data.username || !data.password) {
        return NextResponse.json({'status': false, msg : 'The reqired fields are not present'})
    }
   // const user:string = decrypt(json.user);
  //  const pass:string = decrypt(json.pass);

    const password =crypto.MD5(data.password).toString()

    if (await validateUser(data.username, password)) {

        const cookiename = process.env.NEXT_PUBLIC_cookiestr as string
        let sessionCookie = await readCookie(cookiename)
        
        const sessionstr = findSession(decrypt(String(sessionCookie)))


        if (sessionstr) {
            if (await doesSessionExists(sessionstr, data.username)) {
                return NextResponse.json({'status': 'success', 'msg': 'Session is valid already'})
            } else {
                return NextResponse.json({'status': false, 'msg': 'We can not login in at this time.  Try clearing your cache and try again.'})
            }
        } else {
            const testing = await checkUserForActiveSession(data.username);

            if (await checkUserForActiveSession(data.username) == false) {
                let session = uuidv4().trim() + uuidv4().trim();
                for (let x=0; x<5; x++) {
                    if (session.length < 96) {
                        session = session + uuidv4().trim();
                    }
                }

                let sessionencrypted = ''
                sessionencrypted =  moment().format('SSS') + '|||' + session + '|||' + moment().format('SSS');
                sessionencrypted = encrypt(sessionencrypted)

                await writeCookie(cookiename, sessionencrypted, {
                    secure: true,
                    maxAge: 25200 // 7 hours});
                });

                const insquery = {
                    table: 'Logins',
                    fields: ['session_hash', 'user_id', 'LoginDT', 'ExpireDT'],
                    vals: [session, data.username, convertToMySQLDate(new Date()), setExpireDT()]
                }

                const login = await insert(insquery);
                if (login) {
                    return NextResponse.json({'status': 'success'})
                } else {return NextResponse.json({'status': 'error'})}
            } else {
            //    return NextResponse.json({'testing': 'test'})
                expireSession(data.username);
                return NextResponse.json({'status': false, 'msg': 'Hmmmm we can not login in at this time.  Try clearing your cache and try again.'})
            }
        }
    } else { //end validate user true
        return NextResponse.json({'status': false, 'msg': 'Bad username and password.  Please try again'})
    } //end validate user false
}