import '@/app/globals.css'
import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'
import { readCookie } from '@/common/cookieServer'

import ChecksessionComp from '@/app/components/ChecksessionComp'


const geist = Geist({
  subsets: ['latin'],
})


export default async function Page({ params }: { params: { id: string } }) {

   const cookiename:any = process.env.NEXT_PUBLIC_cookiestr;
      var sessionCookie = await readCookie(cookiename);
      var session = ''
      if (sessionCookie) {
          session = sessionCookie
      }

  return (
    <div className = {geist.className}>
      <ChecksessionComp reverseLogic = {true} session={session} />
      { redirect('/')}
    </div>
  )
}

