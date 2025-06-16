'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { checkValidSession} from '@/common/session'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';

import { redirect } from 'next/navigation'


export async function POST() {
    try {

        const cookieStore = await cookies()
        const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
        const cdata = (await cookieStore).get(cookiename) //todo get from env
        const isValid = await checkValidSession(cdata?.value)

        return NextResponse.json({'valid':isValid})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}