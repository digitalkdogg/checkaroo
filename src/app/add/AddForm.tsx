"use client";
import { useCallback } from "react";
import Input from "@/app/components/Input";
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
//import { useState, useEffect } from 'react';
import { createItem } from "@/app/add/actions2";

interface Props {
  session: string;
}

export default function AddForm(prop:Props) {
  const onClick = useCallback(async () => {
    const { title } = await createItem({ name: "John Doe"}) ; 
    console.log(title);
  }, []);

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