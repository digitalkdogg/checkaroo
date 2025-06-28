import '@/app/globals.css'
import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'

import ChecksessionComp from '@/app/components/ChecksessionComp'


const geist = Geist({
  subsets: ['latin'],
})


export default async function Page({ params }: { params: { id: string } }) {


  return (
    <div className = {geist.className}>
      <ChecksessionComp reverseLogic = {true} />
      { redirect('/')}
    </div>
  )
}

