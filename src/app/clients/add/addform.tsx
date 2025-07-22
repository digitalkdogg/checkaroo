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
        <div>
            <form className="max-w-280" onSubmit={formSubmit}> 
                <div className = "flex flex-col md:flex-row justify-left py-5">
                    <span className="md:basis-32">Client Name :</span>
                    <Input val = '' id = 'ClientName' name = 'ClientName' disabled = {false} />
                </div>
                 <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <Button 
                        id = "addClient"
                        text = "Add Client" 
                        session={prop.session} 
                        url="/api/clients/add" 
                        payload = {['ClientName']}
                        callBack= {handleClick} />
                    <button className="sm:ml-5" type="reset" >Reset</button>
                </div>
                {successEvent && <span className="success">{successEvent}</span>}
                {errorEvent && <span className="error">{errorEvent}</span>}
            </form>
        </div>
    )    

}