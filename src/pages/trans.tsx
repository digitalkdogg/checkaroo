import {  useSearchParams } from 'next/navigation';
import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})

export default function Page() {

    const searchParams = useSearchParams();
    const transid = searchParams?.get('id')

   return (
   
        <div>
            <div className = {geist.className}></div>
             <main className = "flex">
                <Leftside enable = {true} />
                <div className = "flex-3">
                    testing this {transid}
                </div>
             </main>
        </div>

    )

}


