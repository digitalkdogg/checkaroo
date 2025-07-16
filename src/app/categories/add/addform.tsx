'use client'

import Input from "@/app/components/Input";
import Button from '@/app/components/Button'
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

    const handleClick = (data: Callback) => {
           if (data.status == 'error'){
                setErrorEvent(data.msg);
           } else if (data.status == 'success') {
                setSuccessEvent(data.msg)
           } else {
                setErrorEvent('There was an unknown error that occured')
           }
    }

    const handleSubmit = (formData: FormData) => {
        console.log('Form data from custom button:', Object.fromEntries(formData.entries()));
        return
    };

    const formSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const button = document.getElementById('addCat')
        if (button) {
            button.click()
        }
    }

  return (
        <div>
            <form className="max-w-280" onSubmit={formSubmit}> 
                <div className = "flex flex-col md:flex-row justify-left py-5">
                    <span className="md:basis-32">Category Name :</span>
                    <Input val = '' id = 'CategoryName' name = 'CategoryName' disabled = {false} />
                </div>
                 <div className= "flex flex-col sm:flex-row justify-center-safe mb-10 mt-10">
                    <Button 
                        id = "addCat"
                        onSubmit={handleSubmit} 
                        text = "Add Category" 
                        session={prop.session} 
                        url="/api/categories/add" 
                        payload = {['CategoryName']}
                        callBack= {handleClick} />
                </div>
                {successEvent && <span className="success">{successEvent}</span>}
                {errorEvent && <span className="error">{errorEvent}</span>}
            </form>
        </div>
    )    

}