'use server'
import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import AddForm from './AddForm'
import { Geist } from 'next/font/google'

import ChecksessionComp from '@/app/components/ChecksessionComp';


const geist = Geist({
  subsets: ['latin'],
})

export default async function page() {

    var session = ''
    const cookiename:any = process.env.NEXT_PUBLIC_cookiestr;
    var sessionCookie = await readCookie(cookiename);

    if (sessionCookie) {
        session = sessionCookie
    }

    return (
            <div className = {geist.className}>
            <ChecksessionComp reverseLogic = {true} />
            <main className = "flex">
                <Leftside enable = {true} />
                <div className = "flex-3 bg-white flex px-20 py-50 flex-col items-center" >
                   <AddForm session = {session} />
                </div>
            </main>
        </div>
    )
}