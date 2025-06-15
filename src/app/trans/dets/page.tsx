'use client'
import Dets from '@/app/trans/dets/Dets'
import { useSearchParams } from 'next/navigation';
import Leftside from '@/app/components/Leftside'
import { Geist } from 'next/font/google'


const geist = Geist({
  subsets: ['latin'],
})


export default function MyComponent() {
    const searchParams = useSearchParams();
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