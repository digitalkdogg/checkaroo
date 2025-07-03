'use client'

import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react';
import Leftside from '@/app/components/Leftside'
import Loading from '@/app/components/Loading';
import { readCookie } from '@/common/cookieServer';
import Error from '@/app/components/Error'
import { encrypt, superEcnrypt } from '@/common/crypt';

interface componentsProps {
    reverseLogic?: boolean,
}

export default function ChecksessionComp(props:componentsProps) {
      const [loginData, setLoginData] = useState<any>(false)
      const [isLoginLoading, setIsLoginLoading] = useState(true);
      const [loginError, setLoginError] = useState<any>(null);
          
    useEffect(() => {
      checkRedirect()
    }, []);

    const checkRedirect = async () => {
        const cookiename:any = process.env.NEXT_PUBLIC_cookiestr;
        var sessionCookie = await readCookie(cookiename);

        if (!sessionCookie) {
            
            if (props.reverseLogic) {
                return redirect('/login'); // Redirect to the login page
            }
            setIsLoginLoading(false);
            return; // No session cookie, do not redirect
        }
        
        var session = sessionCookie

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  'larva': encrypt('checkaroo') },
            body: JSON.stringify({
                session: superEcnrypt(session),
            })
        })

        if (response.ok) {
            const json = await response.json()
            if(json.valid ==  true) {
            
                if (props.reverseLogic) {
                    setLoginData(true);
                    setIsLoginLoading(false);
                    return;
                }
                return redirect('/'); // Redirect to the home page

            } else {
        
                setLoginData(true);
                setIsLoginLoading(false);
                if (props.reverseLogic) {
                    return redirect('/login'); 
                }
            }
        } else {
            const error = await response.json();
            console.log(error);

            if (props.reverseLogic) {
                setLoginError({message: error.error + '..... I will redirect you to the login page now' })
            } else {
                setLoginError({message: error.error})
            }
            setTimeout(function () {
                if (props.reverseLogic) { // I am not on the login page already
                   return redirect('/login')
                }
            },5000);
        }
   
    } 


    if (loginError) {
        return (
                <div>
                    <main className = "flex">
                        <Leftside enable = {true} />
                        <div className = "flex-3 bg-white flex items-center justify-center" >
                            <Error value = {loginError.message} /> 
                         </div>
                    </main>
                </div>  
        );
    }

    if (isLoginLoading) {
        return (
            <div>
                <main className = "flex" id = "sessioncheck">
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