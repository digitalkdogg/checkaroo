'use server'
import {readCookie} from '@/common/cookieServer'
import Leftside from '@/app/components/Leftside'
import Getall from '@/app/categories/Getall'
import Addbutton from '@/app/components/Addbutton';
import { redirect } from 'next/navigation'

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
    } else {
        redirect('/login');
    }


   

    return (
            <div className = {geist.className}>
            <ChecksessionComp reverseLogic = {true} session = {session} />
            <main className = "flex">
                <Leftside enable = {true} session = {session} />
                <div className = "flex-3">
                    <Getall session = {session} />
                </div>
                <Addbutton url = '/categories/add' />
            </main>
        </div>
    )
}