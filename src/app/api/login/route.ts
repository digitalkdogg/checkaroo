'use server'
import { NextResponse, NextRequest } from 'next/server'
import { checkValidSession} from '@/common/session'
import {decrypt, encrypt} from '@/common/crypt'
import {writelog} from '@/common/logs'

export async function POST(request: NextRequest) {
    try {

        const json = await request.json();
        const sessionstr:string = decrypt(json.session);
        var session:any;

         writelog(sessionstr.toString(), 'special session in logiin here')
        try {
            const sessionsplit = sessionstr.split('|||')
           
            if (sessionsplit.length > 1) {
                session = sessionsplit[1]
            } 

            
        } catch(e) {
           return NextResponse.json({ error: 'Unauthorized Session Parsing Error' }, { status: 401 });
        }
        if (!session || !sessionstr) {
            return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
        }
        const isValid = await checkValidSession(session)

        return NextResponse.json({'valid':isValid})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}