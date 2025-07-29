'use server';

import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import LoginPage from '@/app/login/Loginform'
import { readCookie } from '@/common/cookieServer'
import { redirect } from 'next/navigation'
import ChecksessionComp from '../components/ChecksessionComp';

import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})

export default async function Page() {

    const getSessionCookie = async () => {
        const cookiename = process.env.NEXT_PUBLIC_cookiestr as string;
        const sessionCookie = await readCookie(cookiename);
        let session = ''
        if (sessionCookie) {
            session = sessionCookie
            return session;
        }
        return;
    }

    const session: string|undefined = await getSessionCookie();

    if (session) {
        return (redirect('/'))
    }

    if(!session) {
        return (
            <div className = {geist.className}>
                {session && <ChecksessionComp session = {session} /> }

                <main className = "flex" id = "login-main">
                    <Leftside enable = {false} session="" />
                    <div className = "flex-3 bg-white block">
                        <h2 className = "text-center my-20 -translate-y-0">Please login to use the Checkaroo Web Application and hop into your banking</h2>
                        <div className = "flex justify-center">
                            <LoginPage />
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}