
import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import Login from '@/app/components/Loginform'
import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})


export default function Page() {
 
    return (
        <div className = {geist.className}>
            <div id = "overlay"></div>
            <main className = "flex" id = "login-main">
                <Leftside enable = {false} />
                <div className = "flex-3 bg-white flex justify-center-safe items-center-safe px-20 flex-col ">
                    <h2 className = "text-center my-20 -translate-y-50">Please login to use the Checkaroo Web Application and hop into your banking</h2>
                    <Login />
                </div>
            </main>
        </div>
    )
}