import { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next';
import { encrypt } from '@/common/crypt';
import { convertToMySQLDate } from '@/common/common';
import { insert } from '@/common/dbutils'


export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    setCookie('sicher', encrypt('user:' + username + '||pass:' + password), {maxAge:512, secure:true, sameSite: 'strict'})  

   const response = await fetch('/api/login/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.ok) {
      const json = await response.json()
      const loginerror = document.querySelector('.login-error')
      if (json.data.length > 0 ) {

         // const loginerror = document.querySelector('.login-error')
          if (loginerror) {
            loginerror.classList.remove('error')
            loginerror.classList.remove('notvisible')
          }
          router.push('/')
      } else {
          if (loginerror) {
            loginerror.innerHTML = 'The user name and password are incorrect'
            loginerror.classList.add('error');
            loginerror.classList.remove('notvisible')
          }
      } 

     // router.push('/')
    } else {
      // Handle errors
    }
  }
 
  return (
    <form onSubmit={handleSubmit} className = "-translate-y-50" >
     <div className = "flex my-5">
        <label htmlFor="username">Username : </label>
        <input id = "username" name="username" type = "text"  />
      </div>

      <div className = "flex my-10">
        <label htmlFor="password">Password : </label>
        <input id = "password" name="password" type = "password"  />
      </div>
      
      <br />

      <div className= "flex justify-evenly">
      <button className="inset-shadow-indigo-500" type="submit">Submit</button>
      <button type="reset">Reset</button>
      </div>
        <p className = "login-error notvisible flex justify-evenly mt-5">Login Sucess!  Redirecting Now!</p>
    </form>
  )
}