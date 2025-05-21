import Account from '@/app/components/Account'
import Fetchthis from './components/fetchthis'
//import { getPost } from '@/lib/data'
 
export default async function Page({ params }: { params: { id: string } }) {
  //const post = await getPost(params.id)
 
  return (
    <div>
      <main>
        <Account />
        <Fetchthis />
      </main>
    </div>
  )
}
