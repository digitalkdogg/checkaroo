import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import ChecksessionComp from '@/app/components/ChecksessionComp';
import Dets from '@/app/categories/dets/Dets'
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

//interface SearchParams {
//    id: string;
//}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({searchParams}: {searchParams: any }) {

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
                <div className = "flex-3 bg-white flex px-20 flex-col items-center justify-center" >
                    <Dets session = {session} catid={id} />
                </div>
            </main>
        </div>
    )
}
