'use server'
import Leftside from '@/app/components/Leftside'
import Rightside from '@/app/components/Rightside'
import {checkValidSession} from '@/common/session'
import {select} from '@/common/dbutils'
import { setCookie } from 'cookies-next';

import { Geist } from 'next/font/google'
import { redirect } from 'next/navigation'
import {encrypt} from '@/common/crypt'
//import {cookies} from 'next/headers'

const geist = Geist({
  subsets: ['latin'],
})

interface Trans {
  amount:number
}

var amount = 0


const getTrans = async (transid:any) => {

  setCookie('sicher', 
    encrypt('trans_id :' + transid),
    {maxAge:512, 
    //secure:true, 
    // sameSite: 'strict'
  })  

  const response = await fetch('http://localhost:3000/api/transaction?transid=D95A8AFE67C45', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })


  if (response.ok) {
    const json = await response.json()
    amount = await json.results[0].amount
   //setAmount(json.results[0].amount)
    //return json
  }

}

export default async function Page({ params }: { params: { id: string } }) {

 // const cookieStore = cookies()
  //const cookiename:any = process.env.NEXT_PUBLIC_cookiestr
  //const sessCookie = (await cookieStore).get(cookiename)

  //if (sessCookie) {
   
   // if (await checkValidSession(sessCookie.value) != true) {
   //     redirect('/login')
   // }

    const data = await getTrans('D95A8AFE67C45')

 // }  else {
  //      redirect('/login')
 // }

  return (
    <div className = {geist.className}>
      <main className = "flex">

        <Leftside enable = {true} />
        <div>{amount}</div>
      </main>
    </div>
  )
}
