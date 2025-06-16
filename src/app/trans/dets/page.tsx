'use client'
import Dets from '@/app/trans/dets/Dets'
import { useSearchParams } from 'next/navigation';
import Leftside from '@/app/components/Leftside'
import { Geist } from 'next/font/google'
import { useState, useEffect } from 'react';

const geist = Geist({
  subsets: ['latin'],
})



export default function TransDetsPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })

                const json = await response.json();
                //setData(await json)
                //setData(await response.json())
                if(await json.valid==true) {
                    setIsLoading(false)
                } else {
                    window.location.href = '/login'

                }
            } catch (err) {
                setError(err);
            } finally {
               // console.log(await data);
               //  
                //if (data.valid == true) {
               //     setIsLoading(false);
               // } else {
                  //  redirect('/login')
             //   }
                //redirect('/login')
               // setIsLoading(false);
            }
        }

        fetchSession();
    }, []);

    if (isLoading) {
        return (
            <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">
            </div>
        );
    }

    if (error) {
        return (
         <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">Error: {error.message}</div>
        );
    }

     //  const searchParams = useSearchParams();
        var transid:any = ''
        if (searchParams) {
            transid = searchParams.get('id')
        }

    return (
        <div className = {geist.className}>
            <main className = "flex">
                <Leftside enable = {true} />
                <div className = "flex-3 bg-white flex px-20 flex-col" >
                    <Dets transid = {transid} />
                </div>
            </main>
        </div>
    );
}