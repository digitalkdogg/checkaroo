"use client";
import { useCallback } from "react";
import Input from "@/app/components/Input";
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
import { encrypt, superEcnrypt } from "@/common/crypt";

//import { useState, useEffect } from 'react';


interface Props {
  session: string;
}

export default function AddForm(prop:Props) {
  const onClick = useCallback(async (event:any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get('date');
    const company = formData.get('company');
    const amount = formData.get('amount');
    const category = formData.get('category');  
    const data = {
      date: date,
      company: company,
      amount: amount,
      category: category,
      session: prop.session
    };

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
            console.log(json);
             // setErrorTrans({message: err.error});
        }

  }, []);


 // const onClick = useCallback(async () => {
 //   const { title } = await createItem({ name: "John Doe"}) ; 
 //   console.log(title);
 // }, []);

  console.log(prop);

  return (
  <div >
      <form  onSubmit={onClick} > 
        <div className = "flex flex-row justify-between py-5">
            <span>Date :</span>
            <Datepicker id = "date" name = "date" />
        </div>

        <div className = {'flex flex-row py-5'}>
            <span>Company : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/clients" type = 'clients' session = {prop.session} />
            </div>
        </div>

        <div className = "flex flex-row justify-between py-5">
            <span>Amount :</span>
            <Input id = "amount" name = "amount" val = '' disabled = {false} />
        </div>

        <div className = {'flex flex-row py-5 '}>
            <span>Category : </span>
            <div className="flex">
              <Dropdown val = '' api = "../api/categories" type = 'categories' session = {prop.session} />
            </div>
        </div>

        <div className= "flex justify-center-safe mb-20 mt-10">
            <button className="inset-shadow-indigo-500 mr-5" 
                type="submit">
                    Submit
                </button>
            <button className="ml-5" type="reset">Reset</button>
        </div>
    </form>
  </div>
  )

};