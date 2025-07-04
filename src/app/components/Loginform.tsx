'use client'
import { FormEvent } from 'react'
import { encrypt } from '@/common/crypt';
import {redirect} from 'next/navigation'

import  Loading  from '@/app/components/Loading';

export default function LoginPage() {

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')


    if (validateForm(username, password)) {

      showSubmitSpinner('show')

      const response = await fetch('/api/login/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: encrypt(username), pass:encrypt(password)
        })
      })



      if (response.ok) {

        const json = await response.json()

        var msg = json.msg

        const loginerror = document.querySelector('.login-error')
        if (json.status == 'success' ) {
          if (loginerror) {
            loginerror.classList.remove('error')
            loginerror.classList.remove('notvisible')
            loginerror.innerHTML = 'Login Success! Redirecting Now!'
          }
          redirect('/');

        } else {
          showSubmitSpinner('hide');
          if (loginerror) {
            loginerror.innerHTML = msg
            loginerror.classList.add('error');
            loginerror.classList.remove('notvisible')
          }
      } 
    }
  } 



  function validateForm(username:any, password:any) {
    document.querySelector('.username-error')?.classList.add('notvisible')
    document.querySelector('.password-error')?.classList.add('notvisible')

    if (username.length > 2 && password.length > 2) {
      return true
    } else {
      if (username.length <= 2 ) {
        document.querySelector('.username-error')?.classList.remove('notvisible')
      }

      if (password.length <=2 ) {
        document.querySelector('.password-error')?.classList.remove('notvisible')
      }
    }
    return false;
  }
}

const showSubmitSpinner = (type:string) => {

    var submit = document.getElementById('submit')
    if (submit) { 
      const child = submit.querySelector('span#loadingspan');
      if (child) {
        if (type == 'show') {
          child.classList.remove('notvisible');
        } else {
          child.classList.add('notvisible');
        }
      }
    }
}

const hideErrorMsg = (e:any) => {
  const parent = e.currentTarget.getAttribute('data-error');
  document.querySelector('.'+parent)?.classList.add('notvisible')
}

  return (
    <form onSubmit={handleSubmit} className = "-translate-y-50" >
     <div className = "flex flex-col justify-center-safe">
        <p className = "error username-error notvisible">Username is requried</p>
        <div className = "wrap flex justify-center-safe">
          <label htmlFor="username">Username : </label>
          <input id = "username" name="username" data-error = "username-error" type = "text" onFocus={hideErrorMsg} />
        </div>
      </div>

      <div className = "flex my-5 flex-col justify-center-safe">
         <p className = "error password-error notvisible">Password is requried</p>
         <div className = "wrap flex justify-center-safe">
            <label htmlFor="password">Password : </label>
            <input id = "password" name="password" data-error="password-error" type = "password" onFocus={hideErrorMsg}   />
          </div>
      </div>
      <br />

      <div className= "flex justify-center-safe mb-20">
        <button className="inset-shadow-indigo-500 mr-5 flex flex-row" type="submit" id = "submit">
          <span id = "loadingspan" className = "notvisible mr-0 ml-2"><Loading size={6} /></span>Submit
        </button>
        <button className="ml-5" type="reset">Reset</button>
      </div>
        <div className= "flex justify-center-safe">
          <p className = "login-error notvisible mt-5">Login Sucess!  Redirecting Now!</p>
        </div>
    </form>
  )
}