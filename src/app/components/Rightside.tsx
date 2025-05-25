import Dashboard from '@/app/components/Dashboard'
export default function Page() {
    return (
        <div className ="flex-3">
            <ul role = "menu" className="flex justify-evenly text-lg font-semibold py-4 bg-white">
                <li>Transactions</li>
                <li>Clients</li>
                <li>Categories</li>
            </ul>
            <Dashboard />
        </div>
    )
}