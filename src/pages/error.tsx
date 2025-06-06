
import { Geist } from 'next/font/google'
import Leftside from '@/app/components/Leftside'
import Login from '@/app/components/Loginform'
import '@/app/globals.css'


const geist = Geist({
    subsets: ['latin'],
})

const getURLParams =() => {
   const searchParams = new URLSearchParams(window.location.search);
   return {
       msg: searchParams.get('msg'),
   }
}


export default function Page(data:any) {
   //const { msg } = getURLParams();

    console.log(data);

    return (
        <div className = {geist.className}>
            
            <main className = "flex" id = "login-main">
                <Leftside />
                <div className = "flex-3 bg-white flex justify-center-safe items-center-safe px-20 flex-col ">
                 
                </div>
            </main>
        </div>
    )
}