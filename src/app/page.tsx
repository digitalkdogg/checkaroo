import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import {checkValidSession} from '@/common/session'
import './globals.css'
import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'
import {cookies} from 'next/headers'

const geist = Geist({
  subsets: ['latin'],
})


export default async function Page({ params }: { params: { id: string } }) {

  const cookieStore = cookies()
  const sessCookie = (await cookieStore).get('nothinedetrahamte')

  if (sessCookie) {
   
    if (await checkValidSession(sessCookie.value) != true) {
       //     redirect('/login')
      }
    //return <><Redirect value = "/login" /></>
  }  else {
        redirect('/login')
  }

  return (
    <div className = {geist.className}>
      <main className = "flex">

        <Leftside />
        <Rightside />
      </main>
    </div>
  )
}
