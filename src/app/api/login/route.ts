'use server'
import { NextResponse } from 'next/server'
import {select, insert} from '@/common/dbutils'
import { getDataFromCookie, convertToMySQLDate } from '@/common/common'
import {cookies} from 'next/headers'
import {decrypt, encrypt} from '@/common/crypt'
import crypto from 'crypto-js';


export async function POST() {
    try {
       
        //return NextResponse.json({ 'data': ok, data2: data.session, 'data3': cookie})
    } catch(err) {
        return NextResponse.json({'error': err })
    }
}