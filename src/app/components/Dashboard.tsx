'use server'
import Error from '@/app/components/Error'
import Transrow from '@/app/components/Transrow'
import Loading from '@/app/components/Loading'

export default async function Page() {
  const data = await fetch('http://localhost:3000/api/dashboard')
  
    interface Transaction {
        trans_id: string,
        date: string,
        company_name: string, 
        amount: number,
        category_name: string,
    }

    var trans = await data.json();
    var transdata: Transaction[] = trans.results

    if (transdata.length == undefined) {
      if (trans.results.err.message) {
        return <> <Error value = {trans.results.err.message} /> </>
      }
    }

  //make a transrow component and pass the transdata to it.  
  return (
    <div className = "bg-gray-200 h-dvh">
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