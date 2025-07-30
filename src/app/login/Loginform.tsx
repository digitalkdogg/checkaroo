'use client'
import { FormEvent } from 'react'
import { encrypt } from '@/common/crypt';
import {redirect} from 'next/navigation';
import Button from '@/app/components/Button';
import { useState } from 'react';

import  Loading  from '@/app/components/Loading';

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

 // async function handleSubmit(event: FormEvent<HTMLFormElement>) {
 //   event.preventDefault()

 //   const formData = new FormData(event.currentTarget)
  //  const username = formData.get('username')
   // const password = formData.get('password')


    //if (validateForm(username as string, password as string)) {

     // showSubmitSpinner('show')

     // const response = await fetch('/api/login/auth', {
     //   method: 'POST',
     //   headers: { 'Content-Type': 'application/json' },
     //   body: JSON.stringify({
      //    user: encrypt(username as string), pass:encrypt(password as string)
     //   })
     // })



      //if (response.ok) {

        //const json = await response.json()

        //const msg = json.msg

        //const loginerror = document.querySelector('.login-error')
        //if (json.status == 'success' ) {
          //if (loginerror) {
          //  loginerror.classList.remove('error')
          //  loginerror.classList.remove('notvisible')
          //  loginerror.innerHTML = 'Login Success! Redirecting Now!'
          //}
          //redirect('/');

        //} else {
          //showSubmitSpinner('hide');
          //if (loginerror) {
          //  loginerror.innerHTML = msg
          //  loginerror.classList.add('error');
          //  loginerror.classList.remove('notvisible')
          //}
      //} 
    //}
  //} 



//  function validateForm(username:string, password:string) {
//    document.querySelector('.username-error')?.classList.add('notvisible')
//    document.querySelector('.password-error')?.classList.add('notvisible')

//    if (username.length > 2 && password.length > 2) {
//      return true
//    } else {
//      if (username.length <= 2 ) {
//        document.querySelector('.username-error')?.classList.remove('notvisible')
//      }

//      if (password.length <=2 ) {
//        document.querySelector('.password-error')?.classList.remove('notvisible')
//      }
//    }
//    return false;
//  }
//}

//const showSubmitSpinner = (type:string) => {

//    const submit = document.getElementById('submit')
//    if (submit) { 
//      const child = submit.querySelector('span#loadingspan');
//      if (child) {
//        if (type == 'show') {
//          child.classList.remove('notvisible');
//         // console.log(callbackdata);d} else {
//          child.classList.add('notvisible');
//        }
//      }
//    }
//}


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

const testing = ' <button className="inset-shadow-indigo-500 mr-5 flex flex-row" type="submit" id = "submit"><span id = "loadingspan" className = "notvisible mr-0 ml-2"><Loading size={6} /></span>Submit</button>'

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