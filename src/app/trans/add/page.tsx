'use server'
import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import AddForm from './AddForm'
import { Geist } from 'next/font/google'
import '@/app/globals.css'

import ChecksessionComp from '@/app/components/ChecksessionComp';


const geist = Geist({
  subsets: ['latin'],
})

export default async function page() {

    let session = ''
    const cookiename = process.env.NEXT_PUBLIC_cookiestr as string;
    const sessionCookie = await readCookie(cookiename);

    if (sessionCookie) {
        session = sessionCookie
    }

    return (
            <div className = {geist.className}>
            <ChecksessionComp reverseLogic = {true} session = {session} />
            <main className = "flex flex-col md:flex-row">
                <Leftside enable = {true} session = {session} />
                <div className = "flex-3 bg-white flex md:px-20 md:py-50 flex-col items-center" >
                   <AddForm session = {session} />
                </div>
            </main>
        </div>
    )
}