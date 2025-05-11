import React from "react"

interface User {
    user_id: number;
    name: string;
}

const Home = async () => {
    //const res = await fetch('https://jsonplaceholder.typicode.com/users', {next: {revalidate: 10 }})
    const res = await fetch('http://localhost:3001')
    const users: User[]= await res.json();

    return (
      <div>
        <ul>
          {users.map(user=><li key={user.user_id}>{user.name}</li>)}
        </ul>
      </div>
     )

};

export default Home;


//export default function Home() {
//  return (
//    <div>
//    hello
//    </div>
//  );
//}
