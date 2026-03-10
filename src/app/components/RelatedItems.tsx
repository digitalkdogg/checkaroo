'use client';

import { useState, useEffect } from 'react';
import { superEcnrypt, encrypt } from '@/common/crypt';
import {convertToNiceDate} from '@/common/common'
import Loading from '@/app/components/Loading'

interface Props {
  session: string
  id: string
  api: string
}

interface Item {
    account_id : number,
    trans_id: string,
    date: string,
    amount: number,
    client_id: string,
    company_name?: string,
    category_id: string, 
    category_name?: string
}

interface Err {
    message: string
}

export default function Page(props: Props) {

  const [data, setData] = useState<Item[] | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Err>();
  const [sum, setSum] = useState<number>(0);
  const [avg, setAvg] = useState<number>(0);

  const encryptedSession = superEcnrypt(props.session);
  const encryptedId = encrypt(props.id);

  const fetchRelated = async () => {
    try {
      const res = await fetch(props.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: encryptedSession, id: encryptedId }),
      });

      const json:Item[] | {err:Err} = await res.json();
      setIsLoading(false)
      if (!res.ok || "err" in json) {
        setError({message: (json as {err:Err}).err.message})
      } else {
        if (json.length>0) {
          setData(json)
          setSum(json.reduce((acc, item) => acc + item.amount, 0));
          setAvg(json.reduce((acc, item) => acc + item.amount, 0) / json.length);
        }
      }
    } catch(err:unknown) {
      setError({message: String(err)})
    }
  }


  useEffect(() => {
      fetchRelated();
  },[]);

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (!data) {
    return;
  }

  if (data) {
  return (
    <div className = "justify-center w-full md:w-3/4 overflow-y-scroll scrollbar-hidden mb-10 bg-[var(--color-light-grey)] h-1/2 md:h-1/3 absolute bottom-0 left-0 md:left-1/4 shadow-2xl md:shadow-none border-t border-stone-300">
      <div className = "flex flex-row p-4 sticky md:fixed w-full top-0 md:-mt-15 bg-white shadow-md shadow-lg shadow-green-light/30 z-10 text-xs md:text-base">
        <div className = "indent-1 w-1/4 md:w-1/7"><b>Date</b></div>
        <div className = "indent-1 w-1/4 md:w-5/17"><b>Name</b></div>
        <div className = "indent-1 w-1/4 md:w-1/9"><b>Amount</b></div>
        <div className = "indent-1 w-1/4 md:w-1/5 hidden md:block"><b>Category</b></div>
      </div>
      <div className="pt-10 md:pt-0">
      {data.map(trans => (
          <div  key={trans.trans_id} className="flex flex-row p-4 text-xs md:text-base border-b border-stone-200">
              <div className = "w-1/4 md:w-1/5">{convertToNiceDate(trans.date)}</div>
              <div className = "w-1/4 md:w-2/5 truncate">{trans.company_name}</div>
              <div className = "w-1/4 md:w-1/7">${trans.amount.toFixed(2)}</div>
              <div className = "w-1/4 md:w-1/5 hidden md:block">{trans.category_name}</div>
          </div>
      ))}  
      </div>
      <div className="flex flex-row p-2 fixed w-full bottom-0 bg-white font-bold" id = "bottom-sum">
        <div className="indent-5 w-1/9">Sum: ${sum && <span>{sum.toFixed(2)}</span>}</div>
        <div className="w-1/8 indent-5">Avg: ${avg && <span>{avg.toFixed(2)}</span>}</div>
        <div className="w-1/3 indent-5">Total Items: {data.length}</div>
      </div>
    {error && <div className = "error">{error.message}</div>}
    </div>
  )
  }
}