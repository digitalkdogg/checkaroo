'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { checkValidSession} from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';


export async function POST() {
    try {
        const cookieStore = cookies()
        const cdata = (await cookieStore).get('nothinedetrahamte') //todo get from env
        const isValid = await checkValidSession(cdata?.value)
        return NextResponse.json({'valid':isValid, 'coookie' : cdata})
        //return NextResponse.json({ 'data': ok, data2: data.session, 'data3': cookie})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}