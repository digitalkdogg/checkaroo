export default async function Page() {
  const data = await fetch('http://localhost:3000/api/account?userid=KevinBollman')
  
    interface User {
        account_id: number,
        name: string
    }

    var users = await data.json();
    var usersdata: User[] = users.results

  return (
    <ul>
       {usersdata.map(user => <li key={user.account_id} >{user.name}</li>)}
    </ul>
  )
}