import Leftside from '@/app/components/Leftside'
import './globals.css'
import { Geist } from 'next/font/google'
import { readCookie } from '@/common/cookieServer'
import Dashboard from '@/app/components/Dashboard'
import Addbutton from '@/app/components/Addbutton'


import ChecksessionComp from '@/app/components/ChecksessionComp'


const geist = Geist({
  subsets: ['latin'],
})


export default async function Page() {

  const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
  var session = await readCookie(cookiename)

  if (!session) {
    session = ''
  }

  return (
    <div className = {geist.className}>
      <ChecksessionComp reverseLogic = {true} />
      <main className = "flex">
        <Leftside enable = {true} />
        <div className ="flex-3">
          <Dashboard session = {session} />
          <Addbutton url = '/trans/add' />   
        </div>
      </main>
    </div>
  )
}

