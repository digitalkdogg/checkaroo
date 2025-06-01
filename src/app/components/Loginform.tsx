import { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next';
import { encrypt } from '@/common/crypt';

export default function LoginPage() {



  const router = useRouter()
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    if (validateForm(username, password)) {
      setCookie('sicher', encrypt('user:' + username + '||pass:' + password), {maxAge:512, secure:true, sameSite: 'strict'})  

      const response = await fetch('/api/login/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const json = await response.json()
        const loginerror = document.querySelector('.login-error')
      if (json.data.length > 0 ) {
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

const hideErrorMsg = (e:any) => {
  const parent = e.currentTarget.getAttribute('data-error');
  document.querySelector('.'+parent)?.classList.add('notvisible')
}

  
 
  return (
    <form onSubmit={handleSubmit} className = "-translate-y-50" >
     <div className = "flex flex-col">
        <p className = "error username-error notvisible">Username is requried</p>
        <div className = "wrap">
          <label htmlFor="username">Username : </label>
          <input id = "username" name="username" data-error = "username-error" type = "text" onFocus={hideErrorMsg} />
        </div>
      </div>

      <div className = "flex my-5 flex-col">
         <p className = "error password-error notvisible">Password is requried</p>
         <div className = "wrap">
            <label htmlFor="password">Password : </label>
            <input id = "password" name="password" data-error="password-error" type = "password" onFocus={hideErrorMsg}   />
          </div>
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