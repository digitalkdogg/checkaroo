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
    <div>
       {transdata.map(trans => 
          <div key = {trans.trans_id}>
            <div>{trans.date}</div>
            <div >{trans.company_name}</div>
            <div>{trans.amount}</div>
            <div>{trans.category_name}</div>
          </div>
        )}
    </div>
  )
}