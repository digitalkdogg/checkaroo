import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import './globals.css'
import { Geist } from 'next/font/google'

import { getStaticProps } from 'next/dist/build/templates/pages'

const geist = Geist({
  subsets: ['latin'],
})
 
export default async function Page({ params }: { params: { id: string } }) {
  
  return (
    <div className = {geist.className}>
      <main className = "flex">
        <Leftside />
        <Rightside />
      </main>
    </div>
  )
}
