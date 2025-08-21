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
    <div className = "justify-center w-3/4 overflow-y-scroll scrollbar-hidden mb-10 bg-[var(--color-light-grey)] h-1/3 absolute bottom-0 left-1/4">
      <div className = "flex flex-row p-4 fixed w-full -mt-15 shadow-md shadow-lg shadow-green-light/30">
        <div className = "indent-10 w-1/7"><b>Date</b></div>
        <div className = "indent-5 w-5/17"><b>Company Name</b></div>
        <div className = "indent-5 w-1/9"><b>Amount</b></div>
        <div className = "indent-5 w-1/5"><b>Category Name</b></div>
      </div>
      {data.map(trans => (
          <div  key={trans.trans_id} className="flex flex-row p-4">
              <div className = "indent-5 w-1/5">{convertToNiceDate(trans.date)}</div>
              <div className = "w-2/5">{trans.company_name}</div>
              <div className = "indent-5 w-1/7">{trans.amount.toFixed(2)}</div>
              <div className = "w-1/5">{trans.category_name}</div>
          </div>
      ))}  
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