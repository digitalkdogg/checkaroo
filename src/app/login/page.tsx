'use client';

import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import LoginPage from '@/app/components/Loginform'
import ChecksessionComp from '../components/ChecksessionComp';

import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})

export default function Page() {
 
    return (
        <div className = {geist.className}>
            <ChecksessionComp session = "" />

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