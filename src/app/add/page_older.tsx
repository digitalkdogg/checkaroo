'use client'

import Leftside from '@/app/components/Leftside'
import Input from '@/app/components/Input'
import Dropdown from '@/app/components/Dropdown'
import Datepicker from '@/app/components/Datepicker'
import { Geist } from 'next/font/google'
import { useState, useEffect } from 'react';
import { FormEvent } from 'react'
import '@/app/globals.css'

  import { saveItem } from '@/app/add/actions';


const geist = Geist({
  subsets: ['latin'],
})





export default function Page() {

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        //console.log(event.target)
       // redirect('/save');
        
       event.currentTarget.submit();

    }

     const [startDate, setStartDate] = useState(new Date());

    return (



        <div className = {geist.className}>
            <main className = "flex" id = "login-main">
                <Leftside enable = {true} />
                <div className = "flex-3 bg-white flex justify-center-safe items-center-safe px-20 flex-col ">
                     <form action = {saveItem} onSubmit={handleSubmit} > 
                        <div className = "flex flex-row justify-between py-5">
                            <span>Date :</span>
                            <Datepicker id = "date" name = "date" />
                        </div>

                        <div className = {'flex flex-row justify-between py-5'}>
                            <span>Company : </span>
                            <Dropdown val = '' api = "../api/clients" type = 'clients' />
                        </div>

                        <div className = "flex flex-row justify-between py-5">
                            <span>Amount :</span>
                            <Input id = "amount" name = "amount" val = '' disabled = {false} />
                        </div>

                        <div className = {'flex flex-row justify-between py-5 '}>
                            <span>Category : </span>
                            <Dropdown val = '' api = "../api/categories" type = 'categories' />
                        </div>



                        <div className= "flex justify-center-safe mb-20">
                            <button className="inset-shadow-indigo-500 mr-5" 
                                type="submit">
                                    Submit
                                </button>
                            <button className="ml-5" type="reset">Reset</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}