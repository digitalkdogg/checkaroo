'use client';

import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import LoginPage from '@/app/components/Loginform'
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation'
import Loading from '@/app/components/Loading';

import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})

export default function Page() {
    const [loginData, setLoginData] = useState<any>(false)
    const [isLoginLoading, setIsLoginLoading] = useState(true);
    const [loginError, setLoginError] = useState<any>(null);

    const checkSession = async () => {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
         })
        
          if (response.ok) {
            const json = await response.json()
            if(json.valid ==  true) {
                setLoginData(true)
            } else {
                setIsLoginLoading(false);
            }

          }
        } catch(err) {
            setLoginError(err);
            setIsLoginLoading(false);
        } 
      return false;
      }



    useEffect(() => {
       checkSession()  
    }, []);

    if (loginData) {
        redirect('/');
    }

    if (isLoginLoading) {
        return (
            <div className = {geist.className}>
                <main className = "flex">
                    <Leftside enable = {true} />
                    <div className = "flex-3 bg-white flex items-center justify-center" >
                        <Loading size={24} />
                    </div>
                </main>
            </div>
        )
    }

    if (loginError) {
        return (
            <div className = {geist.className}>
                <main className = "flex">
                    <Leftside enable = {false} />
                    <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">
                        Error: {loginError.message}
                    </div>
                </main>
            </div>
        );
    }   

    return (
        <div className = {geist.className}>

            <main className = "flex" id = "login-main">
                <Leftside enable = {false} />
                <div className = "flex-3 bg-white flex justify-center-safe items-center-safe px-20 flex-col ">
                    <h2 className = "text-center my-20 -translate-y-50">Please login to use the Checkaroo Web Application and hop into your banking</h2>
                    <LoginPage />
                </div>
            </main>
        </div>
    )
}