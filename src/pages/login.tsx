import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import Loginform from '@/app/components/Loginform'
import '@/app/globals.css'
const geist = Geist({
    subsets: ['latin'],
})

export default function Page() {
 
    return (
        <div className = {geist.className}>
            <main className = "flex">
                <Leftside />
                <div className = "flex-3 bg-white flex justify-center-safe items-center-safe px-20 flex-col ">
                    <h2 className = "text-center my-20 -translate-y-50">Please login to use the Checkaroo Web Application and hop into your banking</h2>
                    <Loginform />
                </div>
            </main>
        </div>
    )
}