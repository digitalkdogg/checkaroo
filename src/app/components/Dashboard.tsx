'use server'
import { convertToNiceDate, formatDouble } from "@/common/common";
import { redirect } from 'next/navigation'
import { setCookie, getCookie } from 'cookies-next';
import {cookies} from 'next/headers'


export default async function Page() {
  const data = await fetch('http://localhost:3000/api/dashboard')
  
    interface Transaction {
        trans_id: number,
        date: string,
        company_name: string, 
        amount: number,
        category_name: string,
    }

    var trans = await data.json();
    var transdata: Transaction[] = trans.results

    if (transdata.length == undefined) {
      redirect('/error?msg='+trans.results.err.message )


    }

  return (
    <div className = "bg-gray-200 h-dvh">
      <div className = "header flex py-2 px-4 shadow-md shadow-lg shadow-green-light/30 bg-white text-black">
        <div className="flex-1 font-bold text-green indent-5">Date</div>
        <div className="flex-1 font-bold text-green indent-10">Client</div>
        <div className="flex-1 font-bold text-green">Amount</div>
        <div className="flex-1 font-bold text-green indent-5">Category</div>
      </div>
       {
         transdata.map(trans => 
          <div key = {trans.trans_id} className = "flex p-4 shadow-sm shadow-stone-400 ">
            <div className = "flex-1">{convertToNiceDate(trans.date)}</div>
            <div className = "flex-1">{trans.company_name}</div>
            <div className = "flex-1">${formatDouble(trans.amount)}</div>
            <div className = "flex-1">{trans.category_name}</div>
          </div>
        )}
    </div>
  )
}