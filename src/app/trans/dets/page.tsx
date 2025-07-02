'use server'
import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import { Geist } from 'next/font/google'
import Dets from '@/app/trans/dets/Dets'
import ChecksessionComp from '@/app/components/ChecksessionComp';
import {encrypt} from '@/common/crypt'
import moment from 'moment'

const geist = Geist({
  subsets: ['latin'],
})

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const id:any = (await searchParams).id;
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
                <div className = "flex-3 bg-white flex px-20 flex-col items-center" >
                    <Dets transid = {id} session= {session} />
                </div>
            </main>
        </div>
    )
}