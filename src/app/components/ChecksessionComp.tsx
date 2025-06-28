'use client'

import { useRouter } from 'next/navigation'

const checkRedirect = () =>{
    //redirect('/') 
    const router = useRouter();
    return router.replace('/'); // Redirect to the home page
} 



export default function ChecksessionComp() {


          checkRedirect()



  return (
    <div>
        testing session 
    </div>
  )
}