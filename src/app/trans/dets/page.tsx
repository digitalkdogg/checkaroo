'use server'
import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import { Geist } from 'next/font/google'
import Dets from '@/app/trans/dets/Dets'
import ChecksessionComp from '@/app/components/ChecksessionComp';

const geist = Geist({
  subsets: ['latin'],
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({searchParams}:{searchParams:any }) {
//export default async function page({
//  searchParams,
//}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  searchParams: {[key: string]: string | string[] | Promise<any>}
//}) {
    const id = (await searchParams).id as string;
    let session = ''
    const cookiename = process.env.NEXT_PUBLIC_cookiestr as string;
    const sessionCookie = await readCookie(cookiename);

    if (sessionCookie) {
        session = sessionCookie
    }

    return (
            <div className = {geist.className}>
            <ChecksessionComp reverseLogic = {true} session ={session} />
            <main className = "flex">
                <Leftside enable = {true} session={session} />
                <div className = "flex-3 bg-white flex px-20 flex-col items-center" >
                    <Dets transid = {id} session= {session} />
                </div>
            </main>
        </div>
    )
}