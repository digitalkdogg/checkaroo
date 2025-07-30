'use client'
import {redirect} from 'next/navigation';
import Button from '@/app/components/Button';
import { useState } from 'react';


interface Callback {
    msg: string
    status: string
}

interface Err {
  message?: string
  msg?:string
}

export default function LoginPage() {

  const [success, setSuccess] = useState<string>('')
  const [error, setError] = useState<Err| string>();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputValue.length>3) {
      if (e.key === 'Enter') {
        const buttonid = document.getElementById('submitbtn');
        if (buttonid) {
          buttonid.click();
        }
      }
    }
  };


  const handleCallBack = (callbackdata: Callback) => {
    setSuccess('');
    setError('');

    if (callbackdata.status == 'error') {
      setError(callbackdata.msg)
    } else if (callbackdata.status == 'success') {
      setSuccess(callbackdata.msg)
      setTimeout(() => {
        redirect('/');
      },1000)
    } else {
      setError('There was an unknown error')
    }
  }

  return (
    <form className = "max-w-[520px]" >
        <div className = "flex flex-col">
            <p className = "error username-error notvisible">Username is requried</p>
            <div className = "wrap flex flex-col md:flex-row justify-left">
                <label htmlFor="username">Username : </label>
                <input id = "username" name="username"  type = "text"  autoComplete='true' />
            </div>
        </div>
        <div className = "flex my-5 flex-col">
        <p className = "error password-error notvisible">Password is requried</p>
        <div className = "wrap flex flex-col md:flex-row justify-left">
            <label htmlFor="password">Password : </label>
            <input id = "password" name="password" onKeyDown={handleKeyDown} type = "password" autoComplete='true'  onChange={(e) => setInputValue(e.target.value)} />
          </div>
        </div>
        <br />
        <div className= "flex justify-center-safe mb-10">
            <Button id = "submitbtn" text="Submit" session = "" url="/api/login/auth" payload={['username', 'password']} callBack={handleCallBack} />
            <button className="ml-5" type="reset">Reset</button>
        </div>
        {error && <p className = "error text-center">{error.toString()}</p>}
        {success && <p className = "success text-center">{success}</p>}
    </form>
  )
}