'use client'

import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react';
import Leftside from '@/app/components/Leftside'
import Loading from '@/app/components/Loading';
import { readCookie } from '@/common/cookieServer';


const checkRedirect = async (setLoginData:any, setIsLoginLoading:any) =>{

    const cookiename:any = process.env.NEXT_PUBLIC_cookiestr;
    var sessionCookie = await readCookie(cookiename);

    if (!sessionCookie) {
        setIsLoginLoading(false);
        return; // No session cookie, do not redirect
    }
    
    const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
         })

    if (response.ok) {
        const json = await response.json()
        if(json.valid ==  true) {
            return redirect('/'); // Redirect to the home page
        } else {
            setLoginData(true);
            setIsLoginLoading(false);
            console.log('I stay right here');
        }
    }
} 



export default function ChecksessionComp() {
      const [loginData, setLoginData] = useState<any>(false)
      const [isLoginLoading, setIsLoginLoading] = useState(true);
      const [loginError, setLoginError] = useState<any>(null);
          
    useEffect(() => {
      checkRedirect(setLoginData, setIsLoginLoading)
    }, []);

    if (isLoginLoading) {
        return (
            <div>
                <main className = "flex">
                    <Leftside enable = {true} />
                    <div className = "flex-3 bg-white flex items-center justify-center" >
                        <Loading size={24} />
                    </div>
                </main>
            </div>
        )
    }

  return (<div></div>)
}