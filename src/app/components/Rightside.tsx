import Dashboard from '@/app/components/Dashboard'
import Addbutton from '@/app/components/Addbutton'

export default function Page() {
    return (
        <div className ="flex-3">
            <Dashboard />
            <Addbutton url = '/add' />            
        </div>
    )
}