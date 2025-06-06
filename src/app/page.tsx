import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import './globals.css'
import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'
import {getCookie } from 'cookies-next';

const geist = Geist({
  subsets: ['latin'],
})


const checkSession = async () => {
  const sessionCookie = getCookie('nothinedetrahamte')

  if (!sessionCookie) {
 
    setTimeout(function () {
  //  window.location.href = '/login'
    },1000)
  } 
}


 
export default function Page({ params }: { params: { id: string } }) {
  checkSession();
  return (
    <div className = {geist.className}>
      <main className = "flex">
        <Leftside />
        <Rightside />
      </main>
    </div>
  )
}
