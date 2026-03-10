"use client";

import Input from "@/app/components/Input";
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
import { superEcnrypt } from "@/common/crypt";
import { useState } from 'react';
import { redirect } from 'next/navigation'
import CustomButton from "@/app/components/Button";
import { writeCookie } from "@/common/cookieServer";

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

  const handleResetCallBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const date = document.getElementById('date') as HTMLInputElement | null;
        if (date) {
            //date.value = convertToNiceDate(data?.date.toString()) ?? '';
        }
        const amount = document.getElementById('amount') as HTMLInputElement | null;
        if (amount) {
            amount.value = '';
        }

        const client = document.getElementById('clients_dropinput') as HTMLInputElement | null;
        const clienthidden = document.getElementById('clients_hidden_input') as HTMLInputElement | null;
        if (client && clienthidden) {
            client.placeholder = 'Select Text';
            clienthidden.value = '';
        }

        const cat = document.getElementById('categories_dropinput') as HTMLInputElement | null;
        const cathidden = document.getElementById('categories_hidden_input') as HTMLInputElement | null;
        if (cat && cathidden) {
            cat.placeholder = 'Select Text';
            cathidden.value = '';
        }
    };

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
              const oldbalance:number = json.oldbalance.toFixed(2)
              writeCookie('balance', oldbalance.toString(), {
                secure: false,
                  maxAge: 200,
              });

            redirect('/');
          }
        } else {
          
        }
      }
    }

  return (
  <div className="flex justify-center w-full md:w-1/3 p-4 md:p-0">
      <form  className="bg-white flex flex-col my-4 md:my-10 max-w-full md:max-w-130 w-full justify-left px-6 md:px-12"> 
        <div className = "flex flex-col md:flex-row justify-left py-3 md:py-5">
            <span className="md:basis-32 font-semibold md:font-normal">Date :</span>
            <Datepicker id = "date" name = "date" />
        </div>

        <div className = {'flex flex-col md:flex-row py-3 md:py-5'}>
            <span className = "md:basis-32 font-semibold md:font-normal">Company : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/clients" type = 'clients' session = {prop.session} />
            </div>
        </div>

        <div className = "flex flex-col md:flex-row py-3 md:py-5">
            <span className = "md:basis-32 font-semibold md:font-normal">Amount :</span>
            <Input id = "amount" name = "amount" val = '' disabled = {false} />
        </div>

        <div className = {'flex flex-col md:flex-row py-3 md:py-5 '}>
            <span className = "md:basis-32 font-semibold md:font-normal">Category : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/categories" type = 'categories' session = {prop.session} />
            </div>
        </div>

        <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-6 md:mt-10 border-t-1 border-green-900/50 pt-10 w-full"> 
          <CustomButton 
              id = "addTrans"
              className = "mb-4 sm:mb-0 sm:mr-5 w-full sm:w-auto"
              text = "Add Trans" 
              session={prop.session} 
              url="/api/transaction/add" 
              payload = {['date','clients', 'amount', 'categories']}
              callBack= {handleCallBack} />
            
            <button className="w-full sm:w-auto sm:ml-5 btn" type="reset" onClick={handleResetCallBack}>Reset</button>
        </div>
        {error && <div className="error mt-5">{error.message}</div>}
        {data && <div className="success mt-5">{data}</div>}
    </form>
  </div>
  )

};