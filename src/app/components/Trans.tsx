export default async function Page() {
  const data = await fetch('http://localhost:3000/api/transaction')
  
    interface Transaction {
        trans_id: number,
        date: string,
        amount: number, 
    }

    const trans = await data.json();
    const transdata: Transaction[] = trans.results

  return (
    <div>
       {transdata.map(trans => <div key={trans.trans_id} >{trans.amount}</div>)}
    </div>
  )
}