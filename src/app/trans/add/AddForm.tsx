"use client";

import Input from "@/app/components/Input";
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
import { superEcnrypt } from "@/common/crypt";
import { useState } from 'react';
import { redirect } from 'next/navigation'
import CustomButton from "@/app/components/Button";

interface Props {
  session: string;
}

interface Err {
  message: string
}

interface Callback {
    msg: string
    status: string
}

export default function AddForm(prop:Props) {


  const [data, setData] = useState<string>('')

  const [error, setError] = useState<Err>();

  const handleCallBack = (callbackdata: Callback) => {
      setError({message:''})
      setData('')
      if (callbackdata.status == 'error'){
          setError({message:callbackdata.msg});
      } else if (callbackdata.status == 'success') {
          setData(callbackdata.msg)
          setBalance()
      } else {
          setError({message:'There was an unknown error that occured'})
      }
  }

  const getAmountVal = () => {
    const el = document.getElementById('amount') as HTMLInputElement | null;
    if (el) {
      return el.value;
    } else {
      return '0';
    }
  }
  
  const setBalance = async () => {
    const amount = getAmountVal();
    if (amount != '0') {
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
  }

  return (
  <div >

      <form  className="max-w-130"> 
        <div className = "flex flex-col md:flex-row justify-left py-5">
            <span className="md:basis-32">Date :</span>
            <Datepicker id = "date" name = "date" />
        </div>

        <div className = {'flex flex-col md:flex-row py-5'}>
            <span className = "md:basis-32">Company : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/clients" type = 'clients' session = {prop.session} />
            </div>
        </div>

        <div className = "flex flex-col md:flex-row py-5">
            <span className = "md:basis-32">Amount :</span>
            <Input id = "amount" name = "amount" val = '' disabled = {false} />
        </div>

        <div className = {'flex flex-col md:flex-row py-5 '}>
            <span className = "md:basis-32">Category : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/categories" type = 'categories' session = {prop.session} />
            </div>
        </div>

        <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10"> 
          <CustomButton 
              id = "addTrans"
              className = "mr-5"
              text = "Add Trans" 
              session={prop.session} 
              url="/api/transaction/add" 
              payload = {['date','clients', 'amount', 'categories']}
              callBack= {handleCallBack} />
            
            <button className="sm:ml-5" type="reset">Reset</button>
        </div>
        {error && <div className="error mt-5">{error.message}</div>}
        {data && <div className="success mt-5">{data}</div>}
    </form>
  </div>
  )

};