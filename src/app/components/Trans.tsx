export default async function Page() {
  const data = await fetch('http://localhost:3000/api/transaction')
  
    interface Transaction {
        trans_id: number,
        date: string,
        amount: number, 
    }

    var trans = await data.json();
    var transdata: Transaction[] = trans.results

  return (
    <ul>
       {transdata.map(trans => <li key={trans.trans_id} >{trans.amount}</li>)}
    </ul>
  )
}