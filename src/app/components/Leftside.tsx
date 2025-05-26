export default function Page() {
  return (
    <div className = "flex-1 bg-gradient-to-b from-green to-green-light text-white py-8 px-4 z-20">
      <div className = "logotext text-4xl font-bold">Checkaroo</div>
        <ul role = "menu" className="text-lg font-semibold py-4 menu">
          <li className = "cursor-pointer my-10 ">
            Transactions
          </li>
          <li className = "cursor-pointer my-10">
            Clients
          </li>
          <li className = "cursor-pointer my-10">
            Categories
          </li>
        </ul>
    </div>
  )
}