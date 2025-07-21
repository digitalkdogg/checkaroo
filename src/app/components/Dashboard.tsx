'use server'
import Error from '@/app/components/Error'
import Transrow from '@/app/components/Transrow'
import { superEcnrypt } from '@/common/crypt'

/* @todo : better error handling.  Need to look at use state on the app page */

interface Props {
  session: string,
}


interface Transaction {
  trans_id: string,
  date: string,
  company_name: string, 
  amount: number,
  category_name: string,
  err? : object
}


export default async function Page(prop: Props) {

  const data = await fetch('http://localhost:3000/api/dashboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'referer': 'http://localhost:3000/dashboard'
    },
    body: JSON.stringify({
      session:  superEcnrypt(prop.session),
    })
    });

  const trans = await data.json();
  const transdata: Transaction[] = trans.results

  if (trans.results.err) {
    return <div id = "dash-error"><Error value = {trans.results.err.message} /> </div>
  }

  return (
    <div className = "bg-[var(--color-light-grey)] h-dvh overflow-y-scroll">
      <div className = "header flex py-2 px-4 shadow-md shadow-lg shadow-green-light/30 bg-white text-black">
        <div className="flex-1 font-bold text-green indent-5">Date</div>
        <div className="flex-1 font-bold text-green indent-10">Client</div>
        <div className="flex-1 font-bold text-green">Amount</div>
        <div className="flex-1 font-bold text-green indent-5">Category</div>
      </div>
       {
         transdata.map(trans =>    
          <div key = {trans.trans_id}>   
            <Transrow transId={trans.trans_id} 
              date={trans.date}
              companyName={trans.company_name} 
              amount = {trans.amount} 
              categoryName={trans.category_name} />
          </div>
        )}
    </div>
  )
}