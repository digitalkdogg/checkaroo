"use client";

import Input from "@/app/components/Input";
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
import { encrypt, superEcnrypt } from "@/common/crypt";
import { useState } from 'react';
import Loading from '@/app/components/Loading';
import { redirect } from 'next/navigation'

interface Props {
  session: string;
}

interface Err {
  message: string
}

export default function AddForm(prop:Props) {


  const [data, setData] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Err>();
  //const [amount, setAmount] = useState<any>();
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveData = async (event:any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get('date');
    const clients = formData.get('clients');
    const amount = formData.get('amount');
    const categories = formData.get('categories');  
    const data = {
      date: date,
      clients: clients,
      amount: amount,
      categories: categories,
      session: prop.session
    };

    setIsLoading(true)
    setError({'message':''});
    setData('');
  //  setAmount(data.amount);

    try {

      const response = await fetch('/api/transaction/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: superEcnrypt(data.session),
          data : encrypt(JSON.stringify(data))
        })
      })

      if (response.ok) {
        const json = await response.json();

        if (json.status === 'success') {
          setIsLoading(false);
          setData('Transaction added successfully');
          setBalance(data.amount as string)
          setTimeout(() => {
            setData('');
          }, 5000); // Clear message after 5 seconds
        } else {
            setIsLoading(false);
            setError({message: json.message});
        }
      } else {
        setIsLoading(false);
        setError({message: 'Failed to add transaction. Please try again.'});
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(err:any) {
      setIsLoading(false);
      setError({message: err.message});
    }
  }  
  
  const setBalance = async (amount:string) => {
    
    const response = await fetch('/api/balance/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: superEcnrypt(prop.session),
        data : JSON.stringify({value: amount})
      })
    })

    if (response.ok) {
      const json = await response.json();
      if (json.status=='success') {
        redirect('/');
      } 
    } else {

    }
  }

  return (
  <div >

      <form  onSubmit={saveData} className="max-w-130"> 
        <div className = "flex flex-row justify-left py-5">
            <span className="basis-32">Date :</span>
            <Datepicker id = "date" name = "date" />
        </div>

        <div className = {'flex flex-row py-5'}>
            <span className = "basis-32">Company : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/clients" type = 'clients' session = {prop.session} />
            </div>
        </div>

        <div className = "flex flex-row py-5">
            <span className = "basis-32">Amount :</span>
            <Input id = "amount" name = "amount" val = '' disabled = {false} />
        </div>

        <div className = {'flex flex-row py-5 '}>
            <span className = "basis-32">Category : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/categories" type = 'categories' session = {prop.session} />
            </div>
        </div>

        <div className= "flex justify-center-safe mb-10 mt-10">
            <button className="inset-shadow-indigo-500 mr-5" 
                type="submit">
                   {isLoading && <span className = "inline-flex relative top-1 -left-2" id = "loadingspan"><Loading size={6} /></span>}
                   Submit
                </button>
            <button className="ml-5" type="reset">Reset</button>
        </div>
        {error && <div className="error mt-5">{error.message}</div>}
        {data && <div className="success mt-5">{data}</div>}
    </form>
  </div>
  )

};