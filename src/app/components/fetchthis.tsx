export default async function Page(props: any) {
  //const data = await fetch('http://localhost:3000/api/account?userid=KevinBollman')
  console.log(props);
  const data = await fetch(props.url)
  
    interface User {
        account_id: number,
        name: string
    }

    var users = await data.json();
    //var userdata: props.user[] = users.results
    var usersdata: User[] = users.results

  return (
    <ul>
       {usersdata.map(user => <li key={user.account_id} >{user.name}</li>)}
    </ul>
  )
}