'use server'
import Leftside from '@/app/components/Leftside'
import { getTransDets } from '@/common/common'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {checkValidSession} from '@/common/session'

import { Geist } from 'next/font/google'


const geist = Geist({
  subsets: ['latin'],
})

interface Trans {
  amount:any
}

var data:any 


async function getTrans(transid:string) {
    const dets = await getTransDets(transid)
    return (await dets);
}


export default async function Page({ params }: { params: { id: string } }) {

    const cookieStore = cookies()
    const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
    const sessCookie = (await cookieStore).get(cookiename)

  if (sessCookie) {
   
    if (await checkValidSession(sessCookie.value) != true) {
        redirect('/login')
    }

   // const searchParams = useSearchParams();
   // const transid = searchParams?.get('transid')
    const transid = 'D95A8AFE67C47'

    if (transid) {

        data = await getTrans(transid)
        console.log(data[0].amount);
    }

  }  else {
        redirect('/login')
  }

  return (
    <div className = {geist.className}>
      <main className = "flex">

        <Leftside enable = {true} />
        <div>{data[0].trans_id}</div>
        <div>{data[0].company_name}</div>
        <div>{data[0].amount}</div>
        <div>{data[0].category_name}</div>
      </main>
    </div>
  )
}
