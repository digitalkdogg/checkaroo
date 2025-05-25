import { convertToNiceDate, formatDouble } from "@/common/common";
export default async function Page() {
  const data = await fetch('http://localhost:3000/api/dashboard')
  
    interface Transaction {
        trans_id: number,
        date: string,
        company_name: string, 
        amount: number,
        category_name: string,
    }

    var trans = await data.json();
    var transdata: Transaction[] = trans.results

  return (
    <div className = "bg-gray-200 h-dvh">
      <div className = "header flex py-2 px-4 border-b-2 border-gray-600 bg-white text-black">
        <div className="flex-1 font-medium">Date</div>
        <div className="flex-1 font-medium">Client</div>
        <div className="flex-1 font-medium">Amount</div>
        <div className="flex-1 font-medium">Category</div>
      </div>
       {transdata.map(trans => 
          <div key = {trans.trans_id} className = "flex p-4 border-b-1 border-gray-400">
            <div className = "flex-1">{convertToNiceDate(trans.date)}</div>
            <div className = "flex-1">{trans.company_name}</div>
            <div className = "flex-1">${formatDouble(trans.amount)}</div>
            <div className = "flex-1">{trans.category_name}</div>
          </div>
        )}
    </div>
  )
}