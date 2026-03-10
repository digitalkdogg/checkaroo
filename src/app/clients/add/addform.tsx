'use client'

import Input from "@/app/components/Input";
import Button from '@/app/components/Button'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  session: string;
}

interface Callback {
    msg: string
    status: string
}

export default function AddForm(prop:Props) {
     const [errorEvent, setErrorEvent] = useState<string>();
     const [successEvent, setSuccessEvent] = useState<string>();

    const router = useRouter();

    const handleClick = (callbackdata: Callback) => {
           if (callbackdata.status == 'error'){
                setErrorEvent(callbackdata.msg);
           } else if (callbackdata.status == 'success') {
                setSuccessEvent(callbackdata.msg)
                setTimeout(() => {
                    router.push('/clients')
                },1000)
           } else {
                setErrorEvent('There was an unknown error that occured')
           }
    }

    const formSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const button = document.getElementById('addClient')
        if (button) {
            button.click()
        }
    }

  return (
        <div className="flex justify-center w-full md:w-1/3 p-4 md:p-0">
            <form className="bg-white flex flex-col my-4 md:my-10 max-w-full md:max-w-180 w-full justify-left min-h-[250px] px-6 md:px-12" onSubmit={formSubmit}> 
                <div className = "flex flex-col md:flex-row justify-left py-3 md:py-5">
                    <span className="md:basis-32 mr-3 font-semibold md:font-normal">Client Name :</span>
                    <Input val = '' id = 'ClientName' name = 'ClientName' disabled = {false} />
                </div>
                  <div className= "flex flex-col sm:flex-row justify-center mb-10 mt-6 md:mt-10 border-t-1 border-green-900/50 pt-10 w-full">
                       <Button 
                        id = "addClient"
                        className = "mb-4 sm:mb-0 sm:mr-5 w-full sm:w-auto"
                        text = "Add Client" 
                        session={prop.session} 
                        url="/api/clients/add" 
                        payload = {['ClientName']}
                        callBack= {handleClick} />
                    <button className="w-full sm:w-auto sm:ml-5 btn" type="reset" >Reset</button>
                </div>
                {successEvent && <span className="success">{successEvent}</span>}
                {errorEvent && <span className="error">{errorEvent}</span>}
            </form>
        </div>
    )    

}