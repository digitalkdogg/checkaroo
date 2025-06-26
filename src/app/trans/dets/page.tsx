'use client'
import Dets from '@/app/trans/dets/Dets'
import { useSearchParams } from 'next/navigation';
import Leftside from '@/app/components/Leftside'
import { Geist } from 'next/font/google'
import { useState, useEffect } from 'react';
import SessionCheck from '@/app/components/SessionCheck'
import { redirect } from 'next/navigation'
import Loading from '@/app/components/Loading'

const geist = Geist({
  subsets: ['latin'],
})

export default function TransDetsPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const session = async () => {
        if (await SessionCheck()==false) {
            redirect('/login')
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        session();
    }, []);


    if (isLoading) {
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

    if (error) {
        return (
         <div className = "flex-3 bg-white flex px-20 flex-col my-50 items-center">Error: {error.message}</div>
        );
    }

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