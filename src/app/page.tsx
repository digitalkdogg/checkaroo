import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import './globals.css'
import { Geist } from 'next/font/google'

import ChecksessionComp from '@/app/components/ChecksessionComp'


const geist = Geist({
  subsets: ['latin'],
})


export default async function Page({ params }: { params: { id: string } }) {


  return (
    <div className = {geist.className}>
      <ChecksessionComp reverseLogic = {true} />
      <main className = "flex">
        <Leftside enable = {true} />
        <Rightside />
      </main>
    </div>
  )
}

