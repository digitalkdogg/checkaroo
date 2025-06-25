import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import './globals.css'
import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'
import SessionCheck from '@/app/components/SessionCheck'


const geist = Geist({
  subsets: ['latin'],
})


export default async function Page({ params }: { params: { id: string } }) {

  if (await SessionCheck()==false) {
    redirect('/login')
  }

  return (
    <div className = {geist.className}>


      <main className = "flex">

        <Leftside enable = {true} />
        <Rightside />
      </main>
    </div>
  )
}
