'use server'
import { NextResponse, NextRequest } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { checkValidSession} from '@/common/session'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';

import { redirect } from 'next/navigation'


export async function POST(request: NextRequest) {
    try {

        const json = await request.json();
        const sessionstr:string = decrypt(json.session);
        var session;

        try {
            session = sessionstr.split('|||')[0]
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