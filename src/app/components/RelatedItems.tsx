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
    amount: string,
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

  const encryptedSession = superEcnrypt(props.session);
  const encryptedId = encrypt(props.id);

  const fetchRelated = async () => {
    try {
      const res = await fetch(props.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: encryptedSession, id: encryptedId }),
      });

      const json = await res.json();
      setIsLoading(false)
      if (!res.ok || json.err) {
        setError({message: json.err.message})
      } else {
        if (json.length>0) {
          setData(json)
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
    <div className = "justify-center w-full overflow-y-scroll scrollbar-hidden max-h-164  mb-10">
      <div className = "flex flex-row p-4 no-scale-hover">
        <div className = "indent-5 basis-1/3"><b>Date</b></div>
        <div className = "indent-5 basis-1/4"><b>Company Name</b></div>
        <div className = "indent-5 basis-1/5"><b>Amount</b></div>
        <div className = "indent-5 basis-1/4"><b>Category Name</b></div>
      </div>
      {data.map(trans => (
          <div  key={trans.trans_id} className="flex flex-row p-4 ">
              <div className = "indent-5 basis-1/3">{convertToNiceDate(trans.date)}</div>
              <div className = "indent-5 basis-1/4">{trans.company_name}</div>
              <div className = "indent-5 basis-1/5">{trans.amount}</div>
              <div className = "indent-5 basis-1/4">{trans.category_name}</div>
          </div>
      ))}  
    {error && <div className = "error">{error.message}</div>}
    </div>
  )
  }
}