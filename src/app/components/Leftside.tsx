export default async function Page() {
  return (
    <div className = "flex-1 bg-gradient-to-b from-green to-green-light text-white py-8 px-4 z-20">
      <div className = "logotext text-4xl font-bold">Checkaroo</div>
        <ul role = "menu" className="text-lg font-semibold py-4 ">
          <li className = "cursor-pointer my-10 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:translate-x-3">
            Transactions
          </li>
          <li className = "cursor-pointer my-10 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:translate-x-3">
            Clients
          </li>
          <li className = "cursor-pointer my-10 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:translate-x-3">
            Categories
          </li>
        </ul>
    </div>
  )
}